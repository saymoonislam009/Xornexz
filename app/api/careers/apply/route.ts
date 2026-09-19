import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    
    const jobId = formData.get('jobId');
    const jobTitle = formData.get('jobTitle');
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');
    const resume = formData.get('resume') as File | null;

    if (!jobId || !firstName || !lastName || !email || !resume) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Example Cloudinary upload simulation and Prisma save simulation
    // In a real app, you would use cloudinary SDK and Prisma to save to DB here
    console.log(`Received application for ${jobTitle} from ${firstName} ${lastName}`);
    console.log(`Resume size: ${resume.size} bytes`);
    
    // Simulate DB delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({ 
      success: true,
      message: 'Application submitted successfully'
    }, { status: 200 });
  } catch (error) {
    console.error('Application submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
