# UI Component Library

This directory contains reusable UI components for the Learning Vista application. These components follow the DRY (Don't Repeat Yourself) principle and provide a consistent look and feel across the application.

## Available Components

### Button

A versatile button component with various styles, sizes, and states.

```jsx
import { Button } from '../components/ui';

// Basic usage
<Button>Click me</Button>

// With variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="accent">Accent</Button>
<Button variant="outline">Outline</Button>
<Button variant="success">Success</Button>
<Button variant="warning">Warning</Button>
<Button variant="danger">Danger</Button>

// With sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// Full width
<Button fullWidth>Full Width</Button>

// Loading state
<Button isLoading>Loading</Button>

// Disabled state
<Button disabled>Disabled</Button>

// As a link (using React Router's Link)
<Button as={Link} to="/path">Go to Path</Button>
```

### Input

A form input component with label, icon, and error state support.

```jsx
import { Input } from '../components/ui';

// Basic usage
<Input 
  id="username" 
  label="Username" 
  value={username} 
  onChange={(e) => setUsername(e.target.value)} 
/>

// With icon
<Input 
  id="username" 
  label="Username" 
  value={username} 
  onChange={(e) => setUsername(e.target.value)} 
  icon="👤"
/>

// With error
<Input 
  id="username" 
  label="Username" 
  value={username} 
  onChange={(e) => setUsername(e.target.value)} 
  error="Username is required"
/>

// Different sizes
<Input size="sm" />
<Input size="md" />
<Input size="lg" />
```

### ProgressBar

A progress bar component with various styles and sizes.

```jsx
import { ProgressBar } from '../components/ui';

// Basic usage
<ProgressBar progress={75} />

// With variants
<ProgressBar progress={75} variant="primary" />
<ProgressBar progress={75} variant="secondary" />
<ProgressBar progress={75} variant="accent" />
<ProgressBar progress={75} variant="success" />
<ProgressBar progress={75} variant="warning" />
<ProgressBar progress={75} variant="danger" />
<ProgressBar progress={75} variant="gradient" />

// With sizes
<ProgressBar progress={75} size="sm" />
<ProgressBar progress={75} size="md" />
<ProgressBar progress={75} size="lg" />

// With percentage markers
<ProgressBar progress={75} showPercentage={true} />

// With animation
<ProgressBar progress={75} animated={true} />
```

### ProgressCircle

A circular progress indicator with various styles and sizes.

```jsx
import { ProgressCircle } from '../components/ui';

// Basic usage
<ProgressCircle progress={75} />

// With variants
<ProgressCircle progress={75} variant="primary" />
<ProgressCircle progress={75} variant="secondary" />
<ProgressCircle progress={75} variant="accent" />
<ProgressCircle progress={75} variant="success" />
<ProgressCircle progress={75} variant="warning" />
<ProgressCircle progress={75} variant="danger" />

// With sizes
<ProgressCircle progress={75} size="sm" />
<ProgressCircle progress={75} size="md" />
<ProgressCircle progress={75} size="lg" />
<ProgressCircle progress={75} size="xl" />

// Without percentage text
<ProgressCircle progress={75} showPercentage={false} />

// With animation
<ProgressCircle progress={75} animated={true} />

// Custom stroke width
<ProgressCircle progress={75} strokeWidth={10} />
```

### Card

A card component for containing content.

```jsx
import { Card } from '../components/ui';

// Basic usage
<Card>
  <h2>Card Title</h2>
  <p>Card content</p>
</Card>

// With hover effect
<Card hover={true}>
  <h2>Card Title</h2>
  <p>Card content</p>
</Card>

// Without padding
<Card padding={false}>
  <h2>Card Title</h2>
  <p>Card content</p>
</Card>
```

### Badge

A badge component for displaying status or labels.

```jsx
import { Badge } from '../components/ui';

// Basic usage
<Badge>New</Badge>

// With variants
<Badge variant="primary">Primary</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="accent">Accent</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="info">Info</Badge>
```

## Usage Guidelines

1. Import components from the UI directory:
   ```jsx
   import { Button, Input, ProgressBar } from '../components/ui';
   ```

2. Use the components with appropriate props to maintain consistency.

3. Avoid creating duplicate components or styles that already exist in this library.

4. If you need to extend a component, consider adding the functionality to the existing component rather than creating a new one.

5. Keep the components pure and focused on presentation. Business logic should be handled in the parent components.
