/**
 * Nossa Maternidade - Image Upload Hook
 *
 * Provides image picking and uploading functionality
 * Uses expo-image-picker and the upload-image Edge Function
 *
 * @version 1.0.0
 */

import { useState, useCallback } from "react";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { supabase } from "../api/supabase";
import { getSupabaseUrl } from "../config/env";

// Edge Function URL
const SUPABASE_URL = getSupabaseUrl();
const UPLOAD_FUNCTION_URL = SUPABASE_URL ? `${SUPABASE_URL}/functions/v1/upload-image` : undefined;

export type FolderType = "profiles" | "posts" | "ai-chat" | "community";

export interface UploadedImage {
  url: string;
  path: string;
  width: number;
  height: number;
  size: number;
  mimeType: string;
}

export interface ImageUploadState {
  isLoading: boolean;
  error: string | null;
  progress: number;
  selectedImage: string | null;
  uploadedImage: UploadedImage | null;
}

export interface ImageUploadOptions {
  folder: FolderType;
  resize?: {
    width?: number;
    height?: number;
    maintainAspectRatio?: boolean;
  };
  quality?: number;
  allowsEditing?: boolean;
  aspect?: [number, number];
}

const DEFAULT_OPTIONS: ImageUploadOptions = {
  folder: "posts",
  resize: {
    width: 1200,
    height: 1200,
    maintainAspectRatio: true,
  },
  quality: 0.8,
  allowsEditing: true,
  aspect: [1, 1],
};

/**
 * Custom hook for image selection and upload
 */
export function useImageUpload(options: Partial<ImageUploadOptions> = {}) {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

  const [state, setState] = useState<ImageUploadState>({
    isLoading: false,
    error: null,
    progress: 0,
    selectedImage: null,
    uploadedImage: null,
  });

  /**
   * Request camera permissions
   */
  const requestCameraPermission = useCallback(async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    return status === "granted";
  }, []);

  /**
   * Request media library permissions
   */
  const requestMediaLibraryPermission = useCallback(async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === "granted";
  }, []);

  /**
   * Pick image from gallery
   */
  const pickFromGallery = useCallback(async (): Promise<string | null> => {
    try {
      setState((prev) => ({ ...prev, error: null, isLoading: true }));

      const hasPermission = await requestMediaLibraryPermission();
      if (!hasPermission) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: "Permissão de galeria negada. Por favor, habilite nas configurações.",
        }));
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: mergedOptions.allowsEditing,
        aspect: mergedOptions.aspect,
        quality: mergedOptions.quality,
        base64: false, // We'll read it separately for better control
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        setState((prev) => ({ ...prev, isLoading: false }));
        return null;
      }

      const imageUri = result.assets[0].uri;
      setState((prev) => ({
        ...prev,
        selectedImage: imageUri,
        isLoading: false,
        uploadedImage: null,
      }));

      return imageUri;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao selecionar imagem";
      setState((prev) => ({ ...prev, isLoading: false, error: message }));
      return null;
    }
  }, [
    mergedOptions.allowsEditing,
    mergedOptions.aspect,
    mergedOptions.quality,
    requestMediaLibraryPermission,
  ]);

  /**
   * Take photo with camera
   */
  const takePhoto = useCallback(async (): Promise<string | null> => {
    try {
      setState((prev) => ({ ...prev, error: null, isLoading: true }));

      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: "Permissão de câmera negada. Por favor, habilite nas configurações.",
        }));
        return null;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: mergedOptions.allowsEditing,
        aspect: mergedOptions.aspect,
        quality: mergedOptions.quality,
        base64: false,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        setState((prev) => ({ ...prev, isLoading: false }));
        return null;
      }

      const imageUri = result.assets[0].uri;
      setState((prev) => ({
        ...prev,
        selectedImage: imageUri,
        isLoading: false,
        uploadedImage: null,
      }));

      return imageUri;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao tirar foto";
      setState((prev) => ({ ...prev, isLoading: false, error: message }));
      return null;
    }
  }, [
    mergedOptions.allowsEditing,
    mergedOptions.aspect,
    mergedOptions.quality,
    requestCameraPermission,
  ]);

  /**
   * Upload the selected image to Supabase
   */
  const uploadImage = useCallback(
    async (imageUri?: string): Promise<UploadedImage | null> => {
      const uri = imageUri || state.selectedImage;
      if (!uri) {
        setState((prev) => ({ ...prev, error: "Nenhuma imagem selecionada" }));
        return null;
      }

      if (!supabase) {
        setState((prev) => ({ ...prev, error: "Supabase não configurado" }));
        return null;
      }
      if (!UPLOAD_FUNCTION_URL) {
        setState((prev) => ({ ...prev, error: "URL de upload não configurada" }));
        return null;
      }

      try {
        setState((prev) => ({ ...prev, isLoading: true, progress: 0, error: null }));

        // Get auth session
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.access_token) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: "Você precisa estar logado para fazer upload",
          }));
          return null;
        }

        // Read image as base64
        setState((prev) => ({ ...prev, progress: 10 }));
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: "base64",
        });

        // Detect MIME type from file extension
        const extension = uri.split(".").pop()?.toLowerCase() || "jpg";
        const mimeTypes: Record<string, string> = {
          jpg: "image/jpeg",
          jpeg: "image/jpeg",
          png: "image/png",
          webp: "image/webp",
          gif: "image/gif",
          heic: "image/heic",
          heif: "image/heif",
        };
        const mimeType = mimeTypes[extension] || "image/jpeg";

        // Prepare base64 with data URI prefix
        const base64WithPrefix = `data:${mimeType};base64,${base64}`;

        setState((prev) => ({ ...prev, progress: 30 }));

        // Call Edge Function
        const response = await fetch(UPLOAD_FUNCTION_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            image: base64WithPrefix,
            folder: mergedOptions.folder,
            resize: mergedOptions.resize,
            quality: mergedOptions.quality,
          }),
        });

        setState((prev) => ({ ...prev, progress: 80 }));

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Upload falhou: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || "Upload falhou");
        }

        const uploadedImage: UploadedImage = {
          url: result.url,
          path: result.path,
          width: result.width,
          height: result.height,
          size: result.size,
          mimeType: result.mimeType,
        };

        setState((prev) => ({
          ...prev,
          isLoading: false,
          progress: 100,
          uploadedImage,
        }));

        return uploadedImage;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Erro no upload";
        setState((prev) => ({
          ...prev,
          isLoading: false,
          progress: 0,
          error: message,
        }));
        return null;
      }
    },
    [state.selectedImage, mergedOptions.folder, mergedOptions.resize, mergedOptions.quality]
  );

  /**
   * Pick from gallery and upload in one step
   */
  const pickAndUpload = useCallback(async (): Promise<UploadedImage | null> => {
    const uri = await pickFromGallery();
    if (!uri) return null;
    return uploadImage(uri);
  }, [pickFromGallery, uploadImage]);

  /**
   * Take photo and upload in one step
   */
  const takeAndUpload = useCallback(async (): Promise<UploadedImage | null> => {
    const uri = await takePhoto();
    if (!uri) return null;
    return uploadImage(uri);
  }, [takePhoto, uploadImage]);

  /**
   * Clear selected image
   */
  const clearImage = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      progress: 0,
      selectedImage: null,
      uploadedImage: null,
    });
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    // State
    ...state,

    // Actions
    pickFromGallery,
    takePhoto,
    uploadImage,
    pickAndUpload,
    takeAndUpload,
    clearImage,
    clearError,

    // Permissions
    requestCameraPermission,
    requestMediaLibraryPermission,
  };
}

export default useImageUpload;
