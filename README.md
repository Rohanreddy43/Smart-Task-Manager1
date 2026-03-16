# Smart Task Management Platform with AI Insights

A modern, intelligent task management platform built with React and Spring Boot, featuring AI-powered task insights, real-time collaboration, and smart productivity analytics.

## 🚀 Quick Start

### Prerequisites

- Java 17+
- Node.js 18+
- Maven 3.6+
- Docker (optional, for containerized deployment)
- PostgreSQL (optional, for production)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-task-manager
   ```

2. **Setup the project**
   ```bash
   ./scripts/setup.sh
   ```

3. **Start the backend**
   ```bash
   cd backend
   mvn spring-boot:run
   ```

4. **Start the frontend**
   ```bash
   cd frontend
   npm run dev
   ```

5. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080
   - Swagger UI: http://localhost:8080/swagger-ui.html

### Run Frontend + Backend on One Server

Use this to serve the built frontend from Spring Boot and run everything on `http://localhost:8080`:

```bash
./scripts/run-one-server.sh
```

- App URL: http://localhost:8080
- API URL: http://localhost:8080/api

### Docker Deployment

For production or easy local setup:

```bash
./scripts/deploy.sh
```

This will:
- Build Docker images
- Start PostgreSQL, backend, and frontend services
- Set up networking and volumes
- Run health checks

## 🏗️ Architecture

### Tech Stack

#### Frontend (React)
- **React 18** with TypeScript
- **Vite** for fast development and build
- **React Router** for navigation
- **Redux Toolkit** for state management
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **React Hook Form** for form handling
- **Axios** for API communication

#### Backend (Spring Boot)
- **Spring Boot 3.x** with Java 17
- **Spring Security** with JWT authentication
- **Spring Data JPA** with Hibernate
- **PostgreSQL** database
- **Spring WebSocket** for real-time features
- **Spring Cache** for performance optimization
- **Lombok** for code reduction

#### Infrastructure
- **Docker** for containerization
- **Docker Compose** for local development
- **Render** for cloud deployment
- **GitHub Actions** for CI/CD

### Project Structure

```
smart-task-manager/
├── backend/                    # Spring Boot application
│   ├── src/main/java/com/smarttaskmanager/
│   │   ├── config/            # Configuration classes
│   │   ├── controller/        # REST API controllers
│   │   ├── service/           # Business logic
│   │   ├── repository/        # Data access layer
│   │   ├── model/             # Entity classes
│   │   ├── dto/               # Data transfer objects
│   │   └── security/          # Security configuration
│   └── src/main/resources/
├── frontend/                   # React application
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API service layer
│   │   ├── store/             # Redux store
│   │   ├── hooks/             # Custom hooks
│   │   ├── utils/             # Utility functions
│   │   └── styles/            # Global styles
│   └── vite.config.ts         # Vite configuration
├── docker/                     # Docker configurations
├── docs/                       # Documentation
└── scripts/                    # Deployment and utility scripts
```

## 🎯 Features

### Core Functionality
- **User Authentication & Authorization** - Secure JWT-based authentication
- **Task Management** - Create, update, delete, and organize tasks
- **Project Organization** - Group tasks into projects with custom workflows
- **Real-time Collaboration** - Live updates and team member management
- **Smart Task Insights** - AI-powered task analysis and recommendations

### Advanced Features
- **Task Analytics Dashboard** - Visualize productivity metrics and trends
- **Smart Notifications** - Intelligent reminders and deadline alerts
- **File Attachments** - Upload and manage documents for tasks
- **Search & Filtering** - Advanced search with filters and sorting
- **Responsive Design** - Works seamlessly on desktop and mobile

### AI-Powered Insights
- **Task Complexity Analysis** - AI estimates task difficulty and time required
- **Productivity Patterns** - Identify peak performance times and habits
- **Smart Recommendations** - Suggest optimal task scheduling
- **Completion Predictions** - Forecast task completion based on patterns

## 📖 API Documentation

The backend provides a comprehensive REST API with the following endpoints:

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/auth/check-username` - Check username availability
- `GET /api/auth/check-email` - Check email availability

### Users
- `GET /api/users/me` - Get current user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Projects
- `GET /api/projects` - Get user projects
- `POST /api/projects` - Create project
- `GET /api/projects/{id}` - Get project by ID
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project
- `GET /api/projects/status/{status}` - Get projects by status
- `GET /api/projects/priority/{priority}` - Get projects by priority

### Tasks
- `GET /api/tasks` - Get user tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/{id}` - Get task by ID
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task
- `PUT /api/tasks/{id}/complete` - Complete task
- `GET /api/tasks/search` - Search tasks
- `GET /api/tasks/statistics` - Get task statistics

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/{id}/read` - Mark notification as read
- `DELETE /api/notifications/{id}` - Delete notification

### Analytics
- `GET /api/analytics/tasks` - Get task analytics
- `GET /api/analytics/productivity` - Get productivity metrics
- `GET /api/insights/recommendations` - Get AI recommendations

## 🔧 Configuration

### Environment Variables

#### Backend
```bash
# Database
DB_USERNAME=postgres
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smart_task_manager

# JWT
JWT_SECRET=your-jwt-secret-key

# Application
PORT=8080
```

#### Frontend
```bash
# API Configuration
REACT_APP_API_URL=http://localhost:8080

# Environment
REACT_APP_ENV=development
```

### Database Configuration

The application supports both H2 (for development) and PostgreSQL (for production).

#### Development (H2)
```yaml
spring:
  profiles: dev
  datasource:
    url: jdbc:h2:mem:testdb
    driver-class-name: org.h2.Driver
```

#### Production (PostgreSQL)
```yaml
spring:
  profiles: prod
  datasource:
    url: jdbc:postgresql://localhost:5432/smart_task_manager
    driver-class-name: org.postgresql.Driver
```

## 🚀 Deployment

### Local Development
```bash
# Start backend
cd backend && mvn spring-boot:run

# Start frontend in another terminal
cd frontend && npm run dev
```

### Docker
```bash
# Build and start all services
./scripts/deploy.sh

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Render Deployment

1. **Backend on Render**
   - Create a PostgreSQL instance
   - Deploy Spring Boot application
   - Configure environment variables

2. **Frontend on Render**
   - Deploy React application as static site
   - Configure environment variables for API endpoints

3. **Environment Variables**
   - `DATABASE_URL` - PostgreSQL connection string
   - `JWT_SECRET` - JWT signing secret
   - `FRONTEND_URL` - Frontend application URL
   - `API_BASE_URL` - Backend API URL

### Production Considerations

- Use HTTPS in production
- Set strong JWT secrets
- Configure proper CORS origins
- Set up monitoring and logging
- Use connection pooling for database
- Implement rate limiting
- Set up backup strategies

## 🧪 Testing

### Backend Tests
```bash
cd backend
mvn test
```

### Frontend Tests
```bash
cd frontend
npm test
```

### End-to-End Tests
```bash
# Start application
./scripts/deploy.sh

# Run E2E tests (when implemented)
npm run test:e2e
```

## 📊 Monitoring

### Health Checks
- Backend: http://localhost:8080/actuator/health
- Frontend: http://localhost:3000/health

### Metrics
- Backend metrics: http://localhost:8080/actuator/metrics
- Database metrics: http://localhost:8080/actuator/metrics/jvm.memory.used

### Logs
```bash
# View application logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

## 🔒 Security

### Authentication
- JWT-based authentication
- Password hashing with BCrypt
- Token expiration and refresh
- CORS configuration

### Authorization
- Role-based access control (USER, ADMIN)
- Resource-level permissions
- Secure endpoints

### Best Practices
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF protection (for state-changing operations)

## 🤖 AI Insights

The AI insights feature analyzes user behavior and task patterns to provide:

- **Task Complexity Estimation**: Automatically estimates task complexity based on description and historical data
- **Productivity Analysis**: Identifies peak productivity hours and patterns
- **Smart Scheduling**: Recommends optimal times for task completion
- **Completion Predictions**: Forecasts task completion based on user patterns

## 📈 Performance

### Frontend Optimizations
- Code splitting with React.lazy
- Image optimization
- Bundle analysis
- Caching strategies

### Backend Optimizations
- Database connection pooling
- Query optimization
- Caching with Redis (future enhancement)
- Pagination for large datasets

### Database Optimizations
- Proper indexing
- Query optimization
- Connection pooling
- Regular maintenance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests for your changes
5. Submit a pull request

### Code Style
- Follow existing code style
- Write clear, descriptive commit messages
- Include tests for new features
- Update documentation as needed

### Development Guidelines
- Use TypeScript for type safety
- Write unit tests for all new code
- Follow security best practices
- Document complex logic

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please:
- Open an issue in the repository
- Check the documentation in the `docs/` folder
- Review the API documentation at http://localhost:8080/swagger-ui.html

## 🙏 Acknowledgments

- Spring Boot community
- React community
- All contributors and testers

---

**Note**: This is a comprehensive project for educational and demonstration purposes. For production use, additional security, performance, and scalability considerations would be needed.
