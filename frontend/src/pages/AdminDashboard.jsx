import { useState } from "react";
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
  Loader,
  Center,
  Textarea,
  Pagination,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconEdit, IconTrash, IconPlus } from "@tabler/icons-react";
import { useExercises } from "../hooks/useExercises";
import { useExerciseAdmin } from "../hooks/useExerciseAdmin";
import { useExerciseType } from "../hooks/useExerciseType";
import { MUSCLE_GROUPS } from "../../../backend/src/constants/exercise";

const ITEMS_PER_PAGE = 10;

export function AdminDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Use exercises hook for listing
  const {
    exercises,
    total,
    loading,
    error,
    refetch
  } = useExercises({
    limit: ITEMS_PER_PAGE,
    offset: (currentPage - 1) * ITEMS_PER_PAGE
  });
  
  // Use admin hook for operations
  const { createExercise, updateExercise, deleteExercise } = useExerciseAdmin();
  
  const { exerciseTypes, loading: typesLoading } = useExerciseType();
  
  const form = useForm({
    initialValues: {
      title: "",
      description: "",
      difficulty: "BEGINNER",
      pointsAwarded: 10,
      typeId: "",
      equipment: "",
      muscles: [],
      instructions: [],
    },
    validate: {
      title: (value) => (!value ? 'Title is required' : value.length < 3 ? 'Title must be at least 3 characters' : null),
      description: (value) => (!value ? 'Description is required' : null),
      typeId: (value) => (!value ? 'Exercise type is required' : null),
      instructions: (value) => (value.length === 0 ? 'At least one instruction is required' : null),
      pointsAwarded: (value) => (value < 0 ? 'Points must be positive' : null)
    }
  });
  
  const handleDelete = async (id) => {
    try {
      if (!window.confirm("Are you sure you want to delete this exercise?")) {
        return;
      }
      
      setIsSubmitting(true);
      await deleteExercise(id);
      await refetch(); // Refresh the data after deletion
      
      notifications.show({
        title: "Success",
        message: "Exercise deleted successfully",
        color: "green",
      });
    } catch (err) {
      console.error("Error deleting exercise:", err);
      notifications.show({
        title: "Error",
        message: err.message || 'Failed to delete exercise',
        color: "red",
      });
    } finally {
      setIsSubmitting(false);
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
      equipment: exercise.equipment || "",
      muscles: exercise.muscles || [],
      instructions: exercise.instructions || "",
    });
    setIsModalOpen(true);
  };
  
  const handleSubmit = async (values) => {
    try {
      setIsSubmitting(true);
      const exerciseData = {
        ...values,
        muscles: values.muscles.length > 0 ? values.muscles : []
      };
      
      if (editingExercise) {
        await updateExercise(editingExercise.id, exerciseData);
      } else {
        await createExercise(exerciseData);
      }
      
      await refetch(); // Refresh the data after creation/update
      
      notifications.show({
        title: "Success",
        message: `Exercise ${editingExercise ? 'updated' : 'created'} successfully`,
        color: "green",
      });
      
      setIsModalOpen(false);
      form.reset();
      setEditingExercise(null);
    } catch (err) {
      notifications.show({
        title: "Error",
        message: err.message || 'Failed to save exercise',
        color: "red",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  
  if (loading || typesLoading) {
    return (
      <Center h="70vh">
      <Loader size="xl" />
      </Center>
    );
  }
  
  if (error) {
    return (
      <Container>
      <Text c="red" size="lg" ta="center">
      Error: {error.message}
      </Text>
      </Container>
    );
  }
  
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  
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
    disabled={isSubmitting}
    >
    Add Exercise
    </Button>
    </Group>
    
    <Stack>
    <Table striped highlightOnHover withTableBorder>
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
      disabled={isSubmitting}
      title="Edit exercise"
      >
      <IconEdit size={16} stroke={1.5} />
      </ActionIcon>
      <ActionIcon
      variant="subtle"
      color="red"
      onClick={() => handleDelete(exercise.id)}
      disabled={isSubmitting}
      title="Delete exercise"
      >
      <IconTrash size={16} stroke={1.5} />
      </ActionIcon>
      </Group>
      </Table.Td>
      </Table.Tr>
    ))}
    </Table.Tbody>
    </Table>
    
    {/* Pagination Controls */}
    <Group justify="space-between" mt="md">
    <Text size="sm" c="dimmed">
    Showing {exercises?.length || 0} of {total} exercises
    </Text>
    <Pagination
    value={currentPage}
    onChange={handlePageChange}
    total={totalPages}
    boundaries={1}
    siblings={1}
    />
    </Group>
    </Stack>
    
    {/* Exercise Form Modal */}
    <Modal
    opened={isModalOpen}
    onClose={() => {
      if (!isSubmitting) {
        setIsModalOpen(false);
        setEditingExercise(null);
        form.reset();
      }
    }}
    title={editingExercise ? "Edit Exercise" : "Add New Exercise"}
    size="lg"
    >
    <form onSubmit={form.onSubmit(handleSubmit)}>
    <Stack>
    <TextInput
    label="Title"
    placeholder="Exercise title"
    required
    {...form.getInputProps("title")}
    />
    <Textarea
    label="Description"
    placeholder="Exercise description"
    required
    minRows={3}
    {...form.getInputProps("description")}
    />
    <TextInput
    label="Equipment"
    placeholder="Required equipment"
    {...form.getInputProps("equipment")}
    />
    <Stack mt="md">
    <Text fw={500} size="sm">
    Instructions *
    <Text span c="dimmed" size="xs" fw={400}>
    {" "}(Add each step of the exercise instructions)
    </Text>
    </Text>
    
    {form.values.instructions.map((instruction, index) => (
      <Group key={index} align="flex-end">
      <TextInput
      placeholder={`Step ${index + 1}`}
      value={instruction}
      onChange={(e) => form.setFieldValue(`instructions.${index}`, e.currentTarget.value)}
      style={{ flex: 1 }}
      error={form.errors.instructions && index === 0 ? form.errors.instructions : null}
      />
      <ActionIcon
      color="red"
      variant="subtle"
      onClick={() => form.removeListItem('instructions', index)}
      mb={4}
      >
      <IconTrash size={16} />
      </ActionIcon>
      </Group>
    ))}
    
    <Button
    variant="outline"
    onClick={() => form.insertListItem('instructions', '')}
    leftSection={<IconPlus size={16} />}
    size="sm"
    >
    Add Instruction Step
    </Button>
    </Stack>
    <Select
    label="Exercise Type"
    placeholder="Select exercise type"
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
    data={MUSCLE_GROUPS.map(muscle => ({
      value: muscle,
      label: muscle.replace(/_/g, ' ')  // Replace underscores with spaces
      .toLowerCase()
      .replace(/\b\w/g, l => l.toUpperCase()) // Proper case
    }))}
    searchable
    {...form.getInputProps("muscles")}
    />
    <Select
    label="Difficulty"
    required
    data={[
      { value: 'BEGINNER', label: 'Beginner' },
      { value: 'INTERMEDIATE', label: 'Intermediate' },
      { value: 'ADVANCED', label: 'Advanced' }
    ]}
    {...form.getInputProps("difficulty")}
    />
    <NumberInput
    label="Points Awarded"
    required
    min={0}
    {...form.getInputProps("pointsAwarded")}
    />
    <Button 
    type="submit" 
    loading={isSubmitting}
    mt="md"
    >
    {editingExercise ? "Update" : "Create"} Exercise
    </Button>
    </Stack>
    </form>
    </Modal>
    </Container>
  );
}