import { useQuery, useMutation, gql } from "@apollo/client";
import { useAuth } from "./useAuth";

const GET_USER_PROGRESS = gql`
  query GetUserProgress {
    me {
      id
      progress {
        exerciseType {
          id
          title
        }
        level
        points
      }
    }
  }
`;

const COMPLETE_EXERCISE = gql`
  mutation CompleteExercise($exerciseId: ID!) {
    completeExercise(exerciseId: $exerciseId) {
      exerciseType {
        id
        title
      }
      level
      points
    }
  }
`;

export function useProgress() {
  const { user } = useAuth();

  const {
    data: progressData,
    loading: progressLoading,
    error: progressError,
    refetch: refetchProgress,
  } = useQuery(GET_USER_PROGRESS, {
    fetchPolicy: "network-only",
  });

  const [completeExerciseMutation] = useMutation(COMPLETE_EXERCISE, {
    refetchQueries: [{ query: GET_USER_PROGRESS }],
  });

  const completeExercise = async (exerciseId) => {
    try {
      console.log("Current user:", user);
      console.log("User ID:", user?.uid);
      console.log("Exercise ID:", exerciseId);

      if (!user) {
        throw new Error("No user found in auth context");
      }

      const userId = user.uid;

      if (!userId) {
        throw new Error(
          "User ID not found in user object. Available fields: " +
            Object.keys(user).join(", ")
        );
      }

      const { data } = await completeExerciseMutation({
        variables: {
          exerciseId,
        },
      });

      return data.completeExercise;
    } catch (error) {
      console.error("Error completing exercise:", error);
      const errorMessage =
        error.graphQLErrors?.[0]?.message ||
        error.networkError?.result?.errors?.[0]?.message ||
        error.message ||
        "Failed to complete exercise";
      throw new Error(errorMessage);
    }
  };

  return {
    progress: progressData?.me?.progress || [],
    loading: progressLoading,
    error: progressError,
    completeExercise,
    refetchProgress,
  };
}
