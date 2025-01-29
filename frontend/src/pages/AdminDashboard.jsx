import React, { useState, useMemo } from "react";
import {
  Container,
  Title,
  Table,
  Group,
  Button,
  Modal,
  TextInput,
  NumberInput,
  Select,
  MultiSelect,
  Stack,
  ActionIcon,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconEdit, IconTrash, IconPlus } from "@tabler/icons-react";
import { useExercise } from "../hooks/useExercise";
import { useExerciseType } from "../hooks/useExerciseType";
import { useProfile } from "../hooks/useProfile"

const AdminDashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const { profile, isAdmin } = useProfile();

  const {
    exercises,
    loading,
    error,
    createExercise,
    updateExercise,
    deleteExercise,
  } = useExercise();

  const { getExerciseTypes } = useExerciseType();
  const { exerciseTypes, loading: typesLoading } = getExerciseTypes();

  console.log("Usuário autenticado:", profile);
  console.log("O usuário é admin?", isAdmin);

  const form = useForm({
    initialValues: {
      title: "",
      description: "",
      difficulty: "BEGINNER",
      pointsAwarded: 10,
      typeId: "",
      equipment: "",
      muscles: [],
      instructions: "",
    },
  });

  // Get muscles from each exercise in the data base
  const muscleOptions = useMemo(() => {
    const uniqueMuscles = new Set();
    exercises?.forEach((exercise) => {
      exercise.muscles.forEach((muscle) => uniqueMuscles.add(muscle));
    });
    return Array.from(uniqueMuscles).map((muscle) => ({
      value: muscle,
      label: muscle,
    }));
  }, [exercises]);


  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this exercise?")) {
      try {
        await deleteExercise(id);
        notifications.show({
          title: "Success",
          message: "Exercise deleted successfully",
          color: "green",
        });
      } catch (err) {
        console.error("Error deleting exercise:", err);
        notifications.show({
          title: "Error",
          message: err.message,
          color: "red",
        });
      }
    }
  };
  


  const handleEdit = (exercise) => {
    setEditingExercise(exercise);
    form.setValues({
      title: exercise.title,
      description: exercise.description,
      difficulty: exercise.difficulty,
      pointsAwarded: exercise.pointsAwarded,
      typeId: exercise.type?.id || "",
      equipment: exercise.equipment,
      muscles: exercise.muscles || [],
      instructions: exercise.instructions,
    });
    setIsModalOpen(true);
  };
  

  const handleSubmit = async (values) => {
    try {
      if (!values.typeId) {
        notifications.show({
          title: "Error",
          message: "Please select an exercise type.",
          color: "red",
        });
        return;
      }

      const exerciseData = { ...values };

      if (exerciseData.muscles.length === 0) {
        exerciseData.muscles = [];
      }

      if (editingExercise) {
        await updateExercise(editingExercise.id, exerciseData);
        notifications.show({
          title: "Success",
          message: "Exercise updated successfully",
          color: "green",
        });
      } else {
        await createExercise(exerciseData);
        notifications.show({
          title: "Success",
          message: "Exercise created successfully",
          color: "green",
        });
      }

      setIsModalOpen(false);
      form.reset();
      setEditingExercise(null);
    } catch (err) {
      notifications.show({
        title: "Error",
        message: err.message,
        color: "red",
      });
    }
  };

  if (loading || typesLoading) return <Text>Loading...</Text>;
  if (error) return <Text color="red">Error: {error.message}</Text>;

  return (
    <Container size="xl" py="xl">
      <Group justify="space-between" mb="xl">
        <Title order={2}>Exercise Management</Title>
        <Button
          leftSection={<IconPlus size={20} stroke={1.5} />}
          onClick={() => {
            form.reset();
            setEditingExercise(null);
            setIsModalOpen(true);
          }}
        >
          Add Exercise
        </Button>
      </Group>

      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Name</Table.Th>
            <Table.Th>Type</Table.Th>
            <Table.Th>Difficulty</Table.Th>
            <Table.Th>Points</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {exercises?.map((exercise) => (
            <Table.Tr key={exercise.id}>
              <Table.Td>{exercise.title}</Table.Td>
              <Table.Td>{exercise.type.title}</Table.Td>
              <Table.Td>{exercise.difficulty}</Table.Td>
              <Table.Td>{exercise.pointsAwarded}</Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <ActionIcon
                    variant="subtle"
                    color="blue"
                    onClick={() => handleEdit(exercise)}
                  >
                    <IconEdit size={16} stroke={1.5} />
                  </ActionIcon>
                  <ActionIcon
                    variant="subtle"
                    color="red"
                    onClick={() => handleDelete(exercise.id)}
                  >
                    <IconTrash size={16} stroke={1.5} />
                  </ActionIcon>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Modal
        opened={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingExercise(null);
          form.reset();
        }}
        title={editingExercise ? "Edit Exercise" : "Add New Exercise"}
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <TextInput
              label="Title"
              placeholder="Exercise title"
              required
              {...form.getInputProps("title")}
            />
            <TextInput
              label="Description"
              placeholder="Exercise description"
              required
              {...form.getInputProps("description")}
            />
            <TextInput
              label="Equipment"
              placeholder="Required equipment"
              {...form.getInputProps("equipment")}
            />
            <TextInput
              label="Instructions"
              placeholder="Exercise instructions"
              required
              {...form.getInputProps("instructions")}
            />
            <Select
              label="Exercise Type"
              required
              data={
                exerciseTypes?.map((type) => ({
                  value: type.id,
                  label: type.title,
                })) || []
              }
              {...form.getInputProps("typeId")}
            />
            <MultiSelect
              label="Muscles"
              placeholder="Select muscles used"
              data={muscleOptions}
              {...form.getInputProps("muscles")}
            />
            <Select
              label="Difficulty"
              required
              data={["BEGINNER", "INTERMEDIATE", "ADVANCED"]}
              {...form.getInputProps("difficulty")}
            />
            <NumberInput
              label="Points Awarded"
              required
              min={0}
              {...form.getInputProps("pointsAwarded")}
            />
            <Button type="submit">
              {editingExercise ? "Update" : "Create"} Exercise
            </Button>
          </Stack>
        </form>
      </Modal>
    </Container>
  );
};

export default AdminDashboard;
