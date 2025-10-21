# Component Structure Documentation

## Overview

The application has been refactored into a clean, modular component structure for better maintainability and code organization.

## Component Architecture

```
src/
├── app.tsx                          # Main application component with state management
├── main.tsx                         # Application entry point
└── components/
    ├── Login.tsx                    # Authentication/Login page
    ├── Header.tsx                   # Top navigation bar with user info
    ├── StepIndicator.tsx            # Progress indicator (Step 1, 2, 3)
    ├── UploadImagesStep.tsx         # Step 1: Image upload workflow
    ├── GenerateAudioStep.tsx        # Step 2: Audio generation workflow
    ├── GenerateVideoStep.tsx        # Step 3: Video generation workflow
    ├── ImageUploadZone.tsx          # Reusable image upload component
    ├── ImagePreviewCard.tsx         # Reusable image preview card
    └── InstructionsPanel.tsx        # Image preparation instructions
```

## Component Descriptions

### Main Components

#### `app.tsx`

- **Purpose**: Main application container and state management
- **Responsibilities**:
  - User authentication state
  - Step navigation (1, 2, 3)
  - All business logic and API calls
  - State management for images, audio, and video
- **Lines of Code**: ~320 (down from 868!)

#### `Login.tsx`

- **Purpose**: Handle user authentication
- **Props**: None (handles login flow independently)

#### `Header.tsx`

- **Purpose**: Display user info and logout functionality
- **Props**:
  - `user`: User object with name, email, picture
  - `onLogout`: Logout handler function

#### `StepIndicator.tsx`

- **Purpose**: Visual progress indicator showing current step
- **Props**:
  - `currentStep`: Current step number (1, 2, or 3)

### Step Components

#### `UploadImagesStep.tsx`

- **Purpose**: Complete workflow for uploading two images
- **Features**:
  - Two image upload zones (Full Body & Close Up)
  - Upload button
  - Success message with URLs
  - Instructions panel
- **Props**: See interface in component file

#### `GenerateAudioStep.tsx`

- **Purpose**: Configure and generate audio
- **Features**:
  - Display uploaded images
  - Audio configuration form (kid name, language, gender, story)
  - Audio generation and URL display
- **Props**: See interface in component file

#### `GenerateVideoStep.tsx`

- **Purpose**: Generate final video with all assets
- **Features**:
  - Display all assets (images + audio)
  - Video generation button
  - Success message
  - Download and reset options
- **Props**: See interface in component file

### Reusable Components

#### `ImageUploadZone.tsx`

- **Purpose**: Reusable image upload area
- **Props**:
  - `label`: Display label (e.g., "Full Body Image")
  - `imagePreview`: Preview URL or null
  - `onUpload`: Upload handler
  - `onRemove`: Remove handler

#### `ImagePreviewCard.tsx`

- **Purpose**: Reusable compact image preview with URL
- **Props**:
  - `label`: Display label
  - `imagePreview`: Preview URL
  - `url`: Full URL to copy
  - `onCopy`: Copy to clipboard handler

#### `InstructionsPanel.tsx`

- **Purpose**: Display step-by-step image preparation instructions
- **Features**:
  - Link to Photoroom tool
  - 4 numbered steps
  - Pro tips section
- **Props**: None (self-contained)

## Benefits of This Structure

### 1. **Maintainability**

- Each component has a single responsibility
- Easy to locate and fix bugs
- Clear separation of concerns

### 2. **Reusability**

- `ImageUploadZone` can be used anywhere you need image uploads
- `ImagePreviewCard` can display any image with URL
- `InstructionsPanel` can be moved to different locations

### 3. **Readability**

- Main App.tsx reduced from 868 lines to ~320 lines
- Each step component is self-contained and readable
- Clear props interfaces for TypeScript support

### 4. **Scalability**

- Easy to add new steps
- Easy to modify existing steps without affecting others
- Components can be tested independently

### 5. **Developer Experience**

- TypeScript interfaces provide clear contracts
- Component names are self-documenting
- Easy to understand the flow just by looking at file structure

## How to Add a New Step

1. Create a new component file: `src/components/YourNewStep.tsx`
2. Define the props interface
3. Build your UI using the existing reusable components
4. Import and use in `app.tsx`
5. Add state management in `app.tsx` if needed
6. Update `StepIndicator.tsx` if adding a 4th step

## Best Practices

- **Keep components small**: If a component exceeds 200 lines, consider splitting it
- **Use TypeScript interfaces**: Always define props interfaces
- **Reuse components**: Check existing components before creating new ones
- **Keep state in App.tsx**: Let the main component manage state, components receive props
- **Single responsibility**: Each component should do one thing well

## Example: Understanding Data Flow

```
User uploads image
    ↓
ImageUploadZone receives file
    ↓
UploadImagesStep calls onImageUpload1
    ↓
app.tsx handleImageUpload1 updates state
    ↓
State flows back down as props
    ↓
UI updates with preview
```

## Questions?

If you need to modify the UI or add features, start by identifying which component is responsible for that part of the UI. The component structure should make it obvious!
