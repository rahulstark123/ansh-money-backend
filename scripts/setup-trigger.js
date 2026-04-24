const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  console.log('Setting up Supabase Auth Sync Trigger...');
  try {
    await prisma.$executeRawUnsafe(`
      CREATE OR REPLACE FUNCTION public.handle_new_user()
      RETURNS trigger AS $$
      BEGIN
        INSERT INTO public."User" (id, email, name, "updatedAt")
        VALUES (new.id, new.email, new.raw_user_meta_data->>'name', now());
        RETURN new;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `);
    await prisma.$executeRawUnsafe(`DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;`);
    await prisma.$executeRawUnsafe(`
      CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
    `);
    console.log('✅ Supabase Auth Sync Trigger setup successfully!');
  } catch (error) {
    console.error('❌ Error setting up trigger:', error);
  } finally {
    await prisma.$disconnect();
  }
}
main();
