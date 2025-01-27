// frontend/src/hooks/useProfile.js
import { useQuery, useMutation, gql } from '@apollo/client';
import { auth } from '../config/firebase';

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
        goals
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
        goals
        fitnessLevel
        bio
      }
    }
  }
`;

export function useProfile() {
  const { data, loading, error, refetch } = useQuery(GET_PROFILE);
  const [updateProfile, { loading: updateLoading }] = useMutation(UPDATE_PROFILE);

  const updateProfileData = async (profileData) => {
    try {
      // First, update Firebase display name if name is provided
      if (profileData.name && auth.currentUser) {
        await auth.currentUser.updateProfile({
          displayName: profileData.name
        });
      }

      // Then update our backend
      const { data: updateData } = await updateProfile({
        variables: {
          input: profileData
        }
      });

      // Refetch to get updated data
      await refetch();

      return updateData;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  return {
    profile: data?.me,
    loading: loading || updateLoading,
    error,
    updateProfile: updateProfileData
  };
}