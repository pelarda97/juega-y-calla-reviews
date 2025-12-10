import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Get command line arguments
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('❌ Error: Debes proporcionar la ruta del archivo JSON');
  console.log('\n📖 Uso: npm run upload-review <archivo.json>');
  console.log('   Ejemplo: npm run upload-review mi-reseña.json\n');
  process.exit(1);
}

const jsonFilePath = resolve(args[0]);

// Read environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Variables de entorno no configuradas');
  console.log('\n📝 Asegúrate de tener un archivo .env con:');
  console.log('   VITE_SUPABASE_URL=tu_url');
  console.log('   VITE_SUPABASE_PUBLISHABLE_KEY=tu_key\n');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadReview() {
  try {
    console.log('📂 Leyendo archivo:', jsonFilePath);
    
    // Read and parse JSON file
    const fileContent = readFileSync(jsonFilePath, 'utf-8');
    const reviewData = JSON.parse(fileContent);

    // Validate required fields
    const requiredFields = ['slug', 'title', 'game_title', 'rating'];
    const missingFields = requiredFields.filter(field => !reviewData[field]);
    
    if (missingFields.length > 0) {
      console.error('❌ Error: Faltan campos obligatorios:', missingFields.join(', '));
      process.exit(1);
    }

    console.log('✅ JSON válido');
    console.log('📝 Título:', reviewData.title);
    console.log('🎮 Juego:', reviewData.game_title);
    console.log('⭐ Puntuación:', reviewData.rating);
    console.log('🔗 Slug:', reviewData.slug);

    // Remove INSTRUCCIONES field if present (it's just documentation)
    delete reviewData.INSTRUCCIONES;

    // Check if review already exists
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id, slug')
      .eq('slug', reviewData.slug)
      .single();

    if (existingReview) {
      console.log('\n⚠️  Ya existe una reseña con este slug');
      console.log('📝 Actualizando reseña existente...\n');

      // Update existing review
      const { data, error } = await supabase
        .from('reviews')
        .update(reviewData)
        .eq('slug', reviewData.slug)
        .select();

      if (error) throw error;

      console.log('✅ ¡Reseña actualizada exitosamente!');
      console.log('🔗 URL:', `https://tu-dominio.com/review/${reviewData.slug}`);
    } else {
      console.log('\n📤 Subiendo nueva reseña a Supabase...\n');

      // Insert new review
      const { data, error } = await supabase
        .from('reviews')
        .insert([reviewData])
        .select();

      if (error) throw error;

      console.log('✅ ¡Reseña publicada exitosamente!');
      console.log('🔗 URL:', `https://tu-dominio.com/review/${reviewData.slug}`);
    }

    console.log('\n🎉 Proceso completado. Refresca tu navegador para ver los cambios.\n');

  } catch (error) {
    console.error('\n❌ Error durante la subida:', error.message);
    if (error.code) {
      console.error('   Código de error:', error.code);
    }
    if (error.hint) {
      console.error('   Sugerencia:', error.hint);
    }
    process.exit(1);
  }
}

// Run the upload
uploadReview();
