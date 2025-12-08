import { supabaseAdmin } from '../config/database.js';

const checkStorage = async () => {
    console.log('Checking Supabase Storage...');

    try {
        // List buckets
        const { data: buckets, error: listError } = await supabaseAdmin
            .storage
            .listBuckets();

        if (listError) {
            console.error('❌ Error listing buckets:', listError);
            return;
        }

        console.log('✅ Buckets:', buckets.map(b => b.name));

        const avatarsBucket = buckets.find(b => b.name === 'avatars');

        if (!avatarsBucket) {
            console.log('⚠️ "avatars" bucket not found. Attempting to create...');
            const { data, error: createError } = await supabaseAdmin
                .storage
                .createBucket('avatars', {
                    public: true,
                    fileSizeLimit: 5242880, // 5MB
                    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp']
                });

            if (createError) {
                console.error('❌ Error creating "avatars" bucket:', createError);
            } else {
                console.log('✅ "avatars" bucket created successfully.');
            }
        } else {
            console.log('✅ "avatars" bucket exists.');
        }

    } catch (err) {
        console.error('❌ Unexpected error:', err);
    }
};

checkStorage();
