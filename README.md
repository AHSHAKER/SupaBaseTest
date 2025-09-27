supabase command:
  npx supabase gen types typescript --project-id "lckpdlaeolhfopszwgcg" --schema public > database.types.ts

Supabase Guide: Queries, Authentication, and Storage
1. Introduction
  Supabase is an open-source Firebase alternative that provides: - Database: PostgreSQL with real-time
  capabilities. - Authentication: User management with email, OAuth, magic links. - Storage: File storage for
  images, videos, etc. - Functions: Serverless edge functions.
  This guide focuses on Supabase Queries, Authentication flows, and Storage usage.
2. Supabase Client Setup
  import { createClient } from '@supabase/supabase-js';
  const supabaseUrl = 'YOUR_SUPABASE_URL';
  const supabaseKey = 'YOUR_ANON_KEY';
  const supabase = createClient(supabaseUrl, supabaseKey);
  export default supabase;
3. Database Queries (CRUD)
  Supabase uses PostgREST API for queries.
  3.1 SELECT (Read)
    // Get all users
    const { data, error } = await supabase.from('users').select('*');
    // Get users with filter
    const { data, error } = await supabase.from('users').select('*').eq('role',
    'admin');
    // Select specific columns
    const { data, error } = await supabase.from('users').select('id, email, 
    full_name');
    // Advanced filters
    const { data, error } = await supabase.from('users')
    .select('*')
    .gte('age', 18)
    .lte('age', 30)
    .like('email', '%@gmail.com');
  3.2 INSERT (Create)
    const { data, error } = await supabase.from('users').insert([
    { full_name: 'Jane Doe', email: 'jane@example.com', age: 25 }
    ]);
  3.3 UPDATE
    const { data, error } = await supabase.from('users')
    .update({ full_name: 'Jane Smith' })
    .eq('id', 1);
  3.4 DELETE
    const { data, error } = await supabase.from('users')
    .delete()
    .eq('id', 1);
  3.5 Ordering and Pagination
    const { data, error } = await supabase.from('users')
    .select('*')
    .order('created_at', { ascending: false })
    .range(0, 9); // Pagination: 0-9
4. Authentication
  Supabase Authentication allows email/password and OAuth sign-ins.
  4.1 Sign Up
    const { data, error } = await supabase.auth.signUp({
    email: 'user@example.com',
    password: 'password123',
    options: {
    data: { full_name: 'John Doe', phone: '+1234567890' }
    }
    });
  4.2 Sign In
    const { data, error } = await supabase.auth.signInWithPassword({
    email: 'user@example.com',
    password: 'password123'
    });
  4.3 Sign Out
    const { error } = await supabase.auth.signOut();  
  4.4 Password Reset
    1. Request reset: 
      await supabase.auth.resetPasswordForEmail('user@example.com', {
      redirectTo: 'https://yourapp.com/update-password'
      });
    2. Update password (on update-password page): 
      await supabase.auth.updateUser({ password: 'newpassword123' });
  4.5 Session & User Info
    const session = supabase.auth.getSession();
    const user = supabase.auth.getUser();
5. Realtime
  // Subscribe to changes in 'messages' table
  supabase.from('messages').on('INSERT', payload => {
  console.log('New message:', payload);
  }).subscribe();
6. Storage
  // Upload a file
  const { data, error } = await supabase.storage
  .from('avatars')
  .upload('public/jane.png', file);
  // Download URL
  const { data } = supabase.storage.from('avatars').getPublicUrl('public/
  jane.png');
7. Error Handling
  Supabase methods return 
  if (error) {
    console.error(error.message);
  }
 8. Tips
 • 
• 
• 
{ data, error } . Always check 
Use 
.single() for queries returning one row.
 Use 
eq() , 
neq() , 
gt() , 
lt() , 
• 
error . 
like() for filtering.
 .select('*', { count: 'exact' }) for pagination counts.
 Use 
onAuthStateChange() to listen to login/logout changes.
 4
9. References
 • 
• 
• 
• 
Supabase JS Docs
 Supabase Auth Docs
 Supabase Storage Docs
 Supabase Realtime Docs
 5