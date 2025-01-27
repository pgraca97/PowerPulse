# PowerPulse Backend

## 🚀 Quick Start

```bash
cd backend
npm install
npm run dev
```

## 🔧 Environment Setup
Create a `.env` file with:
```env
PORT=4001
MONGODB_URI=your_mongodb_uri
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 📁 Project Structure

```
src/
├── graphql/
│   ├── schema/
│   │   ├── types/       # GraphQL type definitions
│   │   ├── queries/     # Query definitions
│   │   ├── mutations/   # Mutation definitions
│   │   └── subscriptions/
│   └── resolvers/       # Resolver implementations
├── models/              # Mongoose models
├── services/           # Business logic
└── config/            # Configurations
```

## 📝 Adding New Features

### 1. Define Types (in `schema/types/`)
```graphql
type WorkoutPlan {
  id: ID!
  name: String!
  description: String
  exercises: [Exercise!]!
  difficulty: String!
  duration: Int!
}
```

### 2. Add Queries/Mutations (in respective folders)
```graphql
type Query {
  getWorkoutPlan(id: ID!): WorkoutPlan
  listWorkoutPlans: [WorkoutPlan!]!
}

type Mutation {
  createWorkoutPlan(input: WorkoutPlanInput!): WorkoutPlan!
  updateWorkoutPlan(id: ID!, input: WorkoutPlanInput!): WorkoutPlan!
}
```

### 3. Implement Resolvers
```javascript
export const workoutPlanResolvers = {
  Query: {
    getWorkoutPlan: async (_, { id }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return await WorkoutPlan.findById(id);
    }
  }
};
```

### 4. Add Mongoose Model
```javascript
const workoutPlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  exercises: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' }]
});
```

## ✅ Before Committing
1. Test your queries in Apollo Studio
2. Add proper error handling
3. Validate user authentication
4. Document your code
5. Format your code

## 🔍 Testing Queries

Use Apollo Studio (http://localhost:4001/graphql) to test:

```graphql
query GetWorkoutPlan {
  getWorkoutPlan(id: "123") {
    id
    name
    exercises {
      id
      name
    }
  }
}
```