// app/api/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

// Initialize Prisma client
const prisma = new PrismaClient();

// Zod validation schema
const signupSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters long')
    .max(50, 'Name must be less than 50 characters')
    .trim(),
  
  mobileNumber: z.string()
    .regex(
      /^\+[1-9]\d{1,14}$/, 
      'Mobile number must be in international format (e.g., +1234567890)'
    )
    .min(8, 'Mobile number is too short')
    .max(15, 'Mobile number is too long'),
  
  email: z.string()
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),
  
  password: z.string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Type for validated signup data
type SignupData = z.infer<typeof signupSchema>;

// Response types for better type safety
interface SuccessResponse {
  success: true;
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    mobileNumber: string;
    createdAt: Date;
  };
}

interface ErrorResponse {
  success: false;
  message: string;
  errors?: z.ZodError['errors'];
}

export async function POST(request: NextRequest) {
  try {
    // Parse JSON body
    const body = await request.json();
    
    // Validate request data using Zod
    const validationResult = signupSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          message: 'Validation failed',
          errors: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { name, mobileNumber, email, password }: SignupData = validationResult.data;

    // Check if user already exists with this email or mobile number
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { mobileNumber: mobileNumber }
        ]
      },
      select: {
        email: true,
        mobileNumber: true,
      }
    });

    if (existingUser) {
      const conflictField = existingUser.email === email ? 'email' : 'mobile number';
      return NextResponse.json<ErrorResponse>(
        {
          success: false,
          message: `A user with this ${conflictField} already exists`,
        },
        { status: 409 }
      );
    }

    // Hash the password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user in database
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        mobileNumber,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        mobileNumber: true,
        createdAt: true,
      }
    });

    // Return success response (excluding password)
    return NextResponse.json<SuccessResponse>(
      {
        success: true,
        message: 'User created successfully',
        user: newUser,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Signup API Error:', error);

    // Handle Prisma-specific errors
    if (error instanceof Error) {
      // Database connection errors
      if (error.message.includes('database') || error.message.includes('connection')) {
        return NextResponse.json<ErrorResponse>(
          {
            success: false,
            message: 'Database connection error. Please try again later.',
          },
          { status: 503 }
        );
      }

      // Prisma unique constraint violation (additional safety check)
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json<ErrorResponse>(
          {
            success: false,
            message: 'A user with this email or mobile number already exists',
          },
          { status: 409 }
        );
      }
    }

    // Generic server error
    return NextResponse.json<ErrorResponse>(
      {
        success: false,
        message: 'Internal server error. Please try again later.',
      },
      { status: 500 }
    );
  } finally {
    // Clean up Prisma connection
    await prisma.$disconnect();
  }
}

// Optional: Handle unsupported HTTP methods
export async function GET() {
  return NextResponse.json<ErrorResponse>(
    {
      success: false,
      message: 'Method not allowed',
    },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json<ErrorResponse>(
    {
      success: false,
      message: 'Method not allowed',
    },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json<ErrorResponse>(
    {
      success: false,
      message: 'Method not allowed',
    },
    { status: 405 }
  );
}