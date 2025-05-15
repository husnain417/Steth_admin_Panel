import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(
  request: Request,
  { params }: { params: { pageType: string } }
) {
  try {
    const { pageType } = params;
    console.log(`GET request for pageType: ${pageType}`);

    // Validate pageType
    if (!['home', 'mens', 'womens'].includes(pageType)) {
      return NextResponse.json(
        { success: false, message: 'Invalid page type' },
        { status: 400 }
      );
    }

    // Search for images in Cloudinary
    const [webResult, mobileResult] = await Promise.all([
      cloudinary.search
        .expression(`folder:hero-images/${pageType}/* AND public_id:hero-images/${pageType}/web`)
        .execute(),
      cloudinary.search
        .expression(`folder:hero-images/${pageType}/* AND public_id:hero-images/${pageType}/mobile`)
        .execute(),
    ]);

    const response = {
      success: true,
      data: {
        web: webResult.resources[0] ? {
          pageType,
          viewType: 'web',
          imageUrl: webResult.resources[0].secure_url,
          cloudinaryId: webResult.resources[0].public_id,
        } : null,
        mobile: mobileResult.resources[0] ? {
          pageType,
          viewType: 'mobile',
          imageUrl: mobileResult.resources[0].secure_url,
          cloudinaryId: mobileResult.resources[0].public_id,
        } : null,
      },
    };

    console.log('GET Response:', response);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in GET /api/hero-images/[pageType]:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { pageType: string } }
) {
  try {
    const { pageType } = params;
    console.log(`POST request for pageType: ${pageType}`);

    // Validate pageType
    if (!['home', 'mens', 'womens'].includes(pageType)) {
      return NextResponse.json(
        { success: false, message: 'Invalid page type' },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const webImage = formData.get('webImage') as File;
    const mobileImage = formData.get('mobileImage') as File;

    if (!webImage && !mobileImage) {
      return NextResponse.json(
        { success: false, message: 'No images provided' },
        { status: 400 }
      );
    }

    const uploadPromises = [];

    if (webImage) {
      const webBuffer = await webImage.arrayBuffer();
      uploadPromises.push(
        new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              folder: `hero-images/${pageType}`,
              public_id: 'web',
              overwrite: true,
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(Buffer.from(webBuffer));
        })
      );
    }

    if (mobileImage) {
      const mobileBuffer = await mobileImage.arrayBuffer();
      uploadPromises.push(
        new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              folder: `hero-images/${pageType}`,
              public_id: 'mobile',
              overwrite: true,
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(Buffer.from(mobileBuffer));
        })
      );
    }

    const results = await Promise.all(uploadPromises);
    const response = {
      success: true,
      data: {
        web: webImage ? {
          pageType,
          viewType: 'web',
          imageUrl: results[0].secure_url,
          cloudinaryId: results[0].public_id,
        } : null,
        mobile: mobileImage ? {
          pageType,
          viewType: 'mobile',
          imageUrl: results[webImage ? 1 : 0].secure_url,
          cloudinaryId: results[webImage ? 1 : 0].public_id,
        } : null,
      },
    };

    console.log('POST Response:', response);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in POST /api/hero-images/[pageType]:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 