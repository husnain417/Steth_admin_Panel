import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(
  request: Request,
  { params }: { params: { pageType: string; viewType: string } }
) {
  try {
    const { pageType, viewType } = params;
    console.log(`POST request for pageType: ${pageType}, viewType: ${viewType}`);

    // Validate pageType and viewType
    if (!['home', 'mens', 'womens'].includes(pageType)) {
      return NextResponse.json(
        { success: false, message: 'Invalid page type' },
        { status: 400 }
      );
    }
    if (!['web', 'mobile'].includes(viewType)) {
      return NextResponse.json(
        { success: false, message: 'Invalid view type' },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const image = formData.get('image') as File;

    if (!image) {
      return NextResponse.json(
        { success: false, message: 'No image provided' },
        { status: 400 }
      );
    }

    const buffer = await image.arrayBuffer();
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: `hero-images/${pageType}`,
          public_id: viewType,
          overwrite: true,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(Buffer.from(buffer));
    });

    const response = {
      success: true,
      data: {
        pageType,
        viewType,
        imageUrl: result.secure_url,
        cloudinaryId: result.public_id,
      },
    };

    console.log('POST Response:', response);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in POST /api/hero-images/[pageType]/[viewType]:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { pageType: string; viewType: string } }
) {
  try {
    const { pageType, viewType } = params;
    console.log(`DELETE request for pageType: ${pageType}, viewType: ${viewType}`);

    // Validate pageType and viewType
    if (!['home', 'mens', 'womens'].includes(pageType)) {
      return NextResponse.json(
        { success: false, message: 'Invalid page type' },
        { status: 400 }
      );
    }
    if (!['web', 'mobile'].includes(viewType)) {
      return NextResponse.json(
        { success: false, message: 'Invalid view type' },
        { status: 400 }
      );
    }

    const publicId = `hero-images/${pageType}/${viewType}`;
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== 'ok') {
      return NextResponse.json(
        { success: false, message: 'Failed to delete image' },
        { status: 500 }
      );
    }

    const response = {
      success: true,
      message: 'Image deleted successfully',
    };

    console.log('DELETE Response:', response);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in DELETE /api/hero-images/[pageType]/[viewType]:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 