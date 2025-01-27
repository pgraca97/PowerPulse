// src/hooks/useProfile.js
import { useQuery, useMutation, gql } from '@apollo/client';
import { useAuth } from './useAuth';
import { useCloudinary } from './useCloudinary';

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
  const { user } = useAuth();
  const { uploadToCloudinary } = useCloudinary();
  
  const { data, loading: queryLoading, error: queryError, refetch } = useQuery(GET_PROFILE, {
    skip: !user,
    fetchPolicy: 'network-only',
    onError: (error) => {
      console.error('Profile query error:', error);
    }
  });

  const [updateProfileMutation, { loading: updateLoading }] = useMutation(UPDATE_PROFILE);

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
    updateProfile,
    refetch
  };
}