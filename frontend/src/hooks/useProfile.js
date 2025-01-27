// src/hooks/useProfile.js
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_PROFILE = gql`
  query GetProfile {
    me {
      id
      firebaseUid
      email
      name
      picture {
        url
        publicId
        resourceType
      }
      profile {
        height
        weight
        fitnessLevel
        bio
      }
    }
  }
`;

const GET_SIGNED_UPLOAD_URL = gql`
  mutation GetSignedUploadUrl {
    getSignedUploadUrl {
      signature
      timestamp
      apiKey
    }
  }
`;

const UPDATE_PROFILE = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
      name
      picture {
        url
        publicId
        resourceType
      }
      profile {
        height
        weight
        fitnessLevel
        bio
      }
    }
  }
`;

export function useProfile() {
  const { data, loading: queryLoading, error: queryError, refetch } = useQuery(GET_PROFILE);
  const [getSignedUrl] = useMutation(GET_SIGNED_UPLOAD_URL);
  const [updateProfileMutation, { loading: updateLoading }] = useMutation(UPDATE_PROFILE);

  const uploadToCloudinary = async (file) => {
    // Get signed URL
    const { data: signedUrlData } = await getSignedUrl();
    const { signature, timestamp, apiKey } = signedUrlData.getSignedUploadUrl;

    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);
    formData.append('folder', 'powerpulse/profile-pictures');
    formData.append('transformation', 'c_limit,w_500,h_500,f_auto');

    // Upload to Cloudinary
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`,
      {
        method: 'POST',
        body: formData
      }
    );

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const result = await response.json();
    return result.secure_url;
  };

  const updateProfile = async ({ profilePicture, ...profileData }) => {
    try {
      let pictureUrl;
      
      if (profilePicture) {
        pictureUrl = await uploadToCloudinary(profilePicture);
      }

      const { data: updateData } = await updateProfileMutation({
        variables: {
          input: {
            ...profileData,
            ...(pictureUrl && { pictureUrl })
          }
        }
      });

      await refetch();
      return updateData.updateProfile;
    } catch (error) {
      console.error('Error in updateProfile:', error);
      throw error;
    }
  };

  return {
    profile: data?.me,
    loading: queryLoading || updateLoading,
    error: queryError,
    updateProfile
  };
}