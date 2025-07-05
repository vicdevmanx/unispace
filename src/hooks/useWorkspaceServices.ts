import { useState } from 'react';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../lib/Firebase';
import { uploadImageToCloudinary } from '../utils/cloudinary';
import { Service } from '../types/Workspace';

export function useWorkspaceServices(workspaceId: string | undefined) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listServices = async () => {
    if (!workspaceId) return;
    setLoading(true);
    setError(null);
    try {
      const q = collection(db, 'workspaces', workspaceId, 'services');
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Service));
      setServices(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  const createService = async (service: Partial<Service> & { images?: (File | string)[] }) => {
    if (!workspaceId) return;
    setLoading(true);
    setError(null);
    try {
      // Upload images if any
      let imageUrls: string[] = [];
      if (service.images && service.images.length > 0) {
        imageUrls = await Promise.all(
          service.images.map(async (img) => {
            if (typeof img === 'string') return img;
            return await uploadImageToCloudinary(img);
          })
        );
      }
      const newService = {
        ...service,
        images: imageUrls,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        workspaceId,
      };
      await addDoc(collection(db, 'workspaces', workspaceId, 'services'), newService);
      await listServices();
    } catch (err: any) {
      setError(err.message || 'Failed to create service');
    } finally {
      setLoading(false);
    }
  };

  const updateService = async (serviceId: string, service: Partial<Service> & { images?: (File | string)[] }) => {
    if (!workspaceId) return;
    setLoading(true);
    setError(null);
    try {
      // Upload new images if any
      let imageUrls: string[] = [];
      if (service.images && service.images.length > 0) {
        imageUrls = await Promise.all(
          service.images.map(async (img) => {
            if (typeof img === 'string') return img;
            return await uploadImageToCloudinary(img);
          })
        );
      }
      const updatedService = {
        ...service,
        images: imageUrls,
        updatedAt: new Date().toISOString(),
      };
      await updateDoc(doc(db, 'workspaces', workspaceId, 'services', serviceId), updatedService);
      await listServices();
    } catch (err: any) {
      setError(err.message || 'Failed to update service');
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (serviceId: string) => {
    if (!workspaceId) return;
    setLoading(true);
    setError(null);
    try {
      await deleteDoc(doc(db, 'workspaces', workspaceId, 'services', serviceId));
      await listServices();
    } catch (err: any) {
      setError(err.message || 'Failed to delete service');
    } finally {
      setLoading(false);
    }
  };

  return {
    services,
    loading,
    error,
    listServices,
    createService,
    updateService,
    deleteService,
  };
} 