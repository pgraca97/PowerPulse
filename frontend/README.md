# PowerPulse Frontend

## 🚀 Quick Start

```bash
cd frontend
npm install
npm run dev
```

## 🔧 Environment Setup
Create a `.env` file with:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/     # Layout components
│   ├── forms/      # Form components
│   └── shared/     # Reusable components
├── pages/          # Page components
├── hooks/          # Custom hooks
├── contexts/       # React contexts
├── providers/      # Provider components
└── config/         # Configuration files
```

## 🎨 UI Components

We're using Mantine v7 for UI components. Basic example:

```jsx
import { TextInput, Button, Stack } from '@mantine/core';

export function MyForm() {
  return (
    <Stack>
      <TextInput label="Name" required />
      <Button>Submit</Button>
    </Stack>
  );
}
```

## 📝 Adding New Features

### 1. Create a new page
```jsx
// src/pages/WorkoutPlans.jsx
export function WorkoutPlans() {
  return (
    <Container>
      <Title>Workout Plans</Title>
      {/* Content */}
    </Container>
  );
}
```

### 2. Add route
```jsx
// src/AppRoutes.jsx
<Route
  path="workout-plans"
  element={<ProtectedRoute component={WorkoutPlans} />}
/>
```

### 3. Create GraphQL queries/mutations
```javascript
// src/graphql/workoutPlans.js
export const GET_WORKOUT_PLANS = gql`
  query GetWorkoutPlans {
    workoutPlans {
      id
      name
      exercises {
        id
        name
      }
    }
  }
`;
```

### 4. Implement features using hooks
```javascript
export function useWorkoutPlans() {
  const { data, loading } = useQuery(GET_WORKOUT_PLANS);
  return {
    workoutPlans: data?.workoutPlans || [],
    loading
  };
}
```

## ✅ Before Committing
1. Test your components
2. Check responsive design
3. Verify auth protection
4. Test error states
5. Format your code

## 🎯 Component Guidelines

1. Use Mantine components
2. Implement responsive design
3. Handle loading/error states
4. Use proper TypeScript types
5. Follow existing patterns

## 🔒 Authentication

Authentication is handled through Firebase. Protected routes use the `ProtectedRoute` component:

```jsx
<ProtectedRoute component={SecurePage} />
```

## 📤 File Upload

Use the Cloudinary service for file uploads:

```jsx
const { uploadToCloudinary } = useCloudinary();

const handleUpload = async (file) => {
  const url = await uploadToCloudinary(file);
  // Use url
};
```