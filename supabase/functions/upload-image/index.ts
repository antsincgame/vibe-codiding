import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

type BucketType = 'courses' | 'blog' | 'student-works' | 'general';

const BUCKET_CONFIG: Record<BucketType, { bucket: string; folder: string }> = {
  'courses': { bucket: 'course-images', folder: 'courses' },
  'blog': { bucket: 'student-works-images', folder: 'blog' },
  'student-works': { bucket: 'student-works-images', folder: 'student-works' },
  'general': { bucket: 'student-works-images', folder: 'general' },
};

async function ensureBucketExists(supabaseUrl: string, serviceKey: string, bucketName: string): Promise<void> {
  try {
    const response = await fetch(
      `${supabaseUrl}/storage/v1/bucket/${bucketName}`,
      {
        method: "HEAD",
        headers: {
          authorization: `Bearer ${serviceKey}`,
        },
      }
    );

    if (response.status === 404) {
      const createResponse = await fetch(
        `${supabaseUrl}/storage/v1/bucket`,
        {
          method: "POST",
          headers: {
            authorization: `Bearer ${serviceKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: bucketName,
            public: true,
          }),
        }
      );

      if (!createResponse.ok) {
        const error = await createResponse.text();
        console.error("Failed to create bucket:", error);
        throw new Error("Failed to create bucket");
      }
    }
  } catch (error) {
    console.error("Error checking/creating bucket:", error);
    throw error;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const type = (formData.get("type") as BucketType) || 'general';

    if (!file) {
      return new Response(
        JSON.stringify({ error: "No file provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const config = BUCKET_CONFIG[type] || BUCKET_CONFIG['general'];
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${config.folder}/${fileName}`;

    const buffer = await file.arrayBuffer();
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: "Missing Supabase configuration" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    await ensureBucketExists(supabaseUrl, supabaseServiceKey, config.bucket);

    const contentType = file.type || 'image/jpeg';

    const uploadResponse = await fetch(
      `${supabaseUrl}/storage/v1/object/${config.bucket}/${filePath}`,
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${supabaseServiceKey}`,
          "content-type": contentType,
          "cache-control": "3600",
        },
        body: new Uint8Array(buffer),
      }
    );

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error("Upload failed:", errorText, "Status:", uploadResponse.status);
      return new Response(
        JSON.stringify({
          error: "Failed to upload image",
          details: errorText,
          status: uploadResponse.status
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const imageUrl = `${supabaseUrl}/storage/v1/object/public/${config.bucket}/${filePath}`;

    return new Response(JSON.stringify({ url: imageUrl }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});