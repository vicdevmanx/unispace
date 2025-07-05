import { useState } from 'react';
import { auth, db } from '../lib/Firebase';
import {
  createUserWithEmailAndPassword,
  deleteUser,
} from 'firebase/auth';
import { collection, addDoc, getDocs, deleteDoc, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { uploadImageToCloudinary } from '../utils/cloudinary';
import { Workspace } from '../types/Workspace';



export function useWorkspace() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

  // Create a new workspace (registers a workspace admin user and stores workspace data)
  // const createWorkspace = async (data: {
  //   name: string;
  //   email: string;
  //   password: string;
  //   phoneNumber: string;
  //   imageFile: File;
  //   address: string;
  // }) => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     // 1. Register workspace admin user
  //     const cred = await createUserWithEmailAndPassword(auth, data.email, data.password);
  //     // 2. Upload image to Cloudinary
  //     const imageUrl = await uploadImageToCloudinary(data.imageFile);
  //     // 3. Store workspace data in Firestore
  //     const workspaceData = {
  //       name: data.name,
  //       email: data.email,
  //       phoneNumber: data.phoneNumber,
  //       image: imageUrl,
  //       address: data.address,
  //       createdAt: new Date().toISOString(),
  //       updatedAt: new Date().toISOString(),
  //       adminUid: cred.user.uid,
  //       visible: true,
  //     };
  //     await setDoc(doc(db, 'workspaces', cred.user.uid), workspaceData);
  //     return workspaceData;
  //   } catch (err: any) {
  //     setError(err.message);
  //     return null;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // List all workspaces
  const listWorkspaces = async () => {
    setLoading(true);
    setError(null);
    try {
      const snapshot = await getDocs(collection(db, 'workspaces'));
      const ws = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Workspace[];
      setWorkspaces(ws);
      return ws;
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Delete a workspace
  const deleteWorkspace = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteDoc(doc(db, 'workspaces', id));
      setWorkspaces(prev => prev.filter(w => w.id !== id));
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Toggle workspace visibility (active/inactive)
  const toggleWorkspaceVisibility = async (id: string, visible: boolean) => {
    setLoading(true);
    setError(null);
    try {
      await updateDoc(doc(db, 'workspaces', id), { visible });
      setWorkspaces(prev => prev.map(w => w.id === id ? { ...w, visible } : w));
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Get a single workspace by id
  const getWorkspaceById = async (id: string): Promise<Workspace | null> => {
    setLoading(true);
    setError(null);
    try {
      const wsDoc = await getDoc(doc(db, 'workspaces', id));
      if (wsDoc.exists()) {
        return { id: wsDoc.id, ...wsDoc.data() } as Workspace;
      }
      return null;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    workspaces,
    // createWorkspace,
    listWorkspaces,
    deleteWorkspace,
    toggleWorkspaceVisibility,
    getWorkspaceById,
  };
} 