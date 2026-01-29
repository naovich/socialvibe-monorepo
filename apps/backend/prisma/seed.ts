import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const USERS = [
  { name: 'Alice Martin', username: 'alice', email: 'alice@socialvibe.com', bio: 'Travel enthusiast 🌍 | Coffee addict ☕', avatar: 'https://i.pravatar.cc/150?img=1' },
  { name: 'Bob Johnson', username: 'bob', email: 'bob@socialvibe.com', bio: 'Tech geek | Photographer 📸', avatar: 'https://i.pravatar.cc/150?img=12' },
  { name: 'Charlie Davis', username: 'charlie', email: 'charlie@socialvibe.com', bio: 'Fitness coach 💪 | Healthy lifestyle', avatar: 'https://i.pravatar.cc/150?img=13' },
  { name: 'Diana Prince', username: 'diana', email: 'diana@socialvibe.com', bio: 'Artist 🎨 | Nature lover 🌿', avatar: 'https://i.pravatar.cc/150?img=5' },
  { name: 'Ethan Hunt', username: 'ethan', email: 'ethan@socialvibe.com', bio: 'Adventurer | Skydiver 🪂', avatar: 'https://i.pravatar.cc/150?img=14' },
  { name: 'Fiona Green', username: 'fiona', email: 'fiona@socialvibe.com', bio: 'Food blogger 🍕 | Recipe creator', avatar: 'https://i.pravatar.cc/150?img=9' },
  { name: 'George Smith', username: 'george', email: 'george@socialvibe.com', bio: 'Music producer 🎵 | DJ', avatar: 'https://i.pravatar.cc/150?img=15' },
  { name: 'Hannah Lee', username: 'hannah', email: 'hannah@socialvibe.com', bio: 'Fashion designer ✨ | Style icon', avatar: 'https://i.pravatar.cc/150?img=10' },
  { name: 'Ian Wright', username: 'ian', email: 'ian@socialvibe.com', bio: 'Gamer 🎮 | Streamer', avatar: 'https://i.pravatar.cc/150?img=16' },
  { name: 'Julia Roberts', username: 'julia', email: 'julia@socialvibe.com', bio: 'Writer ✍️ | Book lover 📚', avatar: 'https://i.pravatar.cc/150?img=20' },
  { name: 'Kevin Brown', username: 'kevin', email: 'kevin@socialvibe.com', bio: 'Entrepreneur | Startup founder 🚀', avatar: 'https://i.pravatar.cc/150?img=17' },
  { name: 'Laura Wilson', username: 'laura', email: 'laura@socialvibe.com', bio: 'Yoga instructor 🧘 | Mindfulness', avatar: 'https://i.pravatar.cc/150?img=23' },
  { name: 'Mike Thompson', username: 'mike', email: 'mike@socialvibe.com', bio: 'Software engineer 💻 | Open source', avatar: 'https://i.pravatar.cc/150?img=18' },
  { name: 'Nina Patel', username: 'nina', email: 'nina@socialvibe.com', bio: 'Photographer 📷 | Visual storyteller', avatar: 'https://i.pravatar.cc/150?img=24' },
  { name: 'Oscar Martinez', username: 'oscar', email: 'oscar@socialvibe.com', bio: 'Chef 👨‍🍳 | Culinary artist', avatar: 'https://i.pravatar.cc/150?img=19' },
  { name: 'Paula Anderson', username: 'paula', email: 'paula@socialvibe.com', bio: 'Marketing guru | Brand strategist', avatar: 'https://i.pravatar.cc/150?img=25' },
  { name: 'Quinn Taylor', username: 'quinn', email: 'quinn@socialvibe.com', bio: 'Dancer 💃 | Choreographer', avatar: 'https://i.pravatar.cc/150?img=26' },
  { name: 'Ryan Cooper', username: 'ryan', email: 'ryan@socialvibe.com', bio: 'Cyclist 🚴 | Marathon runner', avatar: 'https://i.pravatar.cc/150?img=21' },
  { name: 'Sarah Miller', username: 'sarah', email: 'sarah@socialvibe.com', bio: 'Interior designer 🏠 | DIY enthusiast', avatar: 'https://i.pravatar.cc/150?img=27' },
  { name: 'Tom Harris', username: 'tom', email: 'tom@socialvibe.com', bio: 'Surfer 🏄 | Beach lover', avatar: 'https://i.pravatar.cc/150?img=22' },
];

const POSTS_CONTENT = [
  { caption: 'Just got back from an amazing trip to Paris! 🗼✨', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800' },
  { caption: 'New camera gear arrived! Time to create some magic 📸', image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800' },
  { caption: 'Morning workout done ✅ Feeling energized! 💪', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800' },
  { caption: 'Finished this painting today 🎨 What do you think?', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800' },
  { caption: 'Skydiving was INSANE! Best adrenaline rush ever 🪂', image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800' },
  { caption: 'Homemade pizza night! Recipe on my blog 🍕', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800' },
  { caption: 'Studio session vibes 🎵🎹', image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800' },
  { caption: 'New collection preview! Launching next week ✨', image: 'https://images.unsplash.com/photo-1558769132-cb1aea86f7e6?w=800' },
  { caption: 'Stream was lit tonight! Thanks for the raid 🎮', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800' },
  { caption: 'Reading corner goals 📚☕', image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800' },
  { caption: 'Startup life: coffee, code, repeat 🚀', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800' },
  { caption: 'Sunset yoga session by the beach 🧘‍♀️🌅', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800' },
  { caption: 'Debugging at 2 AM... again 😅💻', image: 'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=800' },
  { caption: 'Golden hour magic ✨📷', image: 'https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?w=800' },
  { caption: 'Tasting menu turned out perfect! 👨‍🍳', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800' },
  { caption: 'Campaign launch day! So proud of the team 🎯', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800' },
  { caption: 'Rehearsal for the big show tomorrow 💃', image: 'https://images.unsplash.com/photo-1508807526345-15e9b5f4eaff?w=800' },
  { caption: '50km ride today! New personal record 🚴‍♂️', image: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800' },
  { caption: 'Before and after: living room makeover 🏠', image: 'https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=800' },
  { caption: 'Perfect waves this morning 🏄‍♂️🌊', image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800' },
];

const COMMENTS_TEMPLATES = [
  'Amazing! 😍',
  'Love this! ❤️',
  'So cool! 🔥',
  'Great shot!',
  'Wow! This is incredible 🤩',
  'Goals! 🙌',
  'Beautiful!',
  'Inspiring! ✨',
  'Need this in my life!',
  'Absolutely stunning!',
  'You\'re so talented! 👏',
  'Can\'t wait to try this!',
  'This made my day 😊',
  'Perfect! 💯',
  'Impressive work!',
];

async function main() {
  console.log('🌱 Starting seed...');

  // Clean database
  console.log('🧹 Cleaning database...');
  await prisma.comment.deleteMany();
  await prisma.like.deleteMany();
  await prisma.post.deleteMany();
  await prisma.friendship.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  console.log('👥 Creating users...');
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const createdUsers: any[] = [];
  for (const userData of USERS) {
    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        coverImage: `https://images.unsplash.com/photo-${1500000000000 + Math.random() * 100000000000}?w=1200&h=400&fit=crop`,
      },
    });
    createdUsers.push(user);
  }
  console.log(`✅ Created ${createdUsers.length} users`);

  // Create friendships (realistic network)
  console.log('🤝 Creating friendships...');
  const friendships: any[] = [];
  for (let i = 0; i < createdUsers.length; i++) {
    // Each user has 3-8 friends
    const numFriends = 3 + Math.floor(Math.random() * 6);
    const friendIndices = new Set<number>();
    
    while (friendIndices.size < numFriends) {
      const friendIndex = Math.floor(Math.random() * createdUsers.length);
      if (friendIndex !== i && !friendIndices.has(friendIndex)) {
        friendIndices.add(friendIndex);
      }
    }

    for (const friendIndex of friendIndices) {
      try {
        const friendship = await prisma.friendship.create({
          data: {
            userId: createdUsers[i].id,
            friendId: createdUsers[friendIndex].id,
            status: 'ACCEPTED',
          },
        });
        friendships.push(friendship);
      } catch (error) {
        // Ignore duplicate friendships
      }
    }
  }
  console.log(`✅ Created ${friendships.length} friendships`);

  // Create posts (2-4 posts per user)
  console.log('📝 Creating posts...');
  const createdPosts: any[] = [];
  for (const user of createdUsers) {
    const numPosts = 2 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < numPosts; i++) {
      const postContent = POSTS_CONTENT[Math.floor(Math.random() * POSTS_CONTENT.length)];
      const post = await prisma.post.create({
        data: {
          caption: postContent.caption,
          image: postContent.image,
          authorId: user.id,
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random within last 7 days
        },
      });
      createdPosts.push(post);
    }
  }
  console.log(`✅ Created ${createdPosts.length} posts`);

  // Create likes (users like random posts)
  console.log('❤️ Creating likes...');
  const createdLikes: any[] = [];
  for (const user of createdUsers) {
    // Each user likes 10-20 random posts
    const numLikes = 10 + Math.floor(Math.random() * 11);
    const likedPostIndices = new Set<number>();

    while (likedPostIndices.size < numLikes) {
      const postIndex = Math.floor(Math.random() * createdPosts.length);
      const post = createdPosts[postIndex];
      
      // Don't like own posts
      if (post.authorId !== user.id && !likedPostIndices.has(postIndex)) {
        likedPostIndices.add(postIndex);
        
        try {
          const like = await prisma.like.create({
            data: {
              postId: post.id,
              userId: user.id,
            },
          });
          createdLikes.push(like);
        } catch (error) {
          // Ignore duplicate likes
        }
      }
    }
  }
  console.log(`✅ Created ${createdLikes.length} likes`);

  // Create comments
  console.log('💬 Creating comments...');
  const createdComments: any[] = [];
  for (const user of createdUsers) {
    // Each user comments on 5-10 random posts
    const numComments = 5 + Math.floor(Math.random() * 6);
    
    for (let i = 0; i < numComments; i++) {
      const post = createdPosts[Math.floor(Math.random() * createdPosts.length)];
      
      // Don't comment on own posts (mostly)
      if (post.authorId !== user.id || Math.random() > 0.8) {
        const comment = await prisma.comment.create({
          data: {
            text: COMMENTS_TEMPLATES[Math.floor(Math.random() * COMMENTS_TEMPLATES.length)],
            postId: post.id,
            authorId: user.id,
            createdAt: new Date(post.createdAt.getTime() + Math.random() * 24 * 60 * 60 * 1000),
          },
        });
        createdComments.push(comment);
      }
    }
  }
  console.log(`✅ Created ${createdComments.length} comments`);

  // Create nested comments (replies)
  console.log('↩️ Creating comment replies...');
  const replies: any[] = [];
  for (let i = 0; i < 30; i++) {
    const parentComment = createdComments[Math.floor(Math.random() * createdComments.length)];
    const user = createdUsers[Math.floor(Math.random() * createdUsers.length)];
    
    const reply = await prisma.comment.create({
      data: {
        text: COMMENTS_TEMPLATES[Math.floor(Math.random() * COMMENTS_TEMPLATES.length)],
        postId: parentComment.postId,
        authorId: user.id,
        parentId: parentComment.id,
      },
    });
    replies.push(reply);
  }
  console.log(`✅ Created ${replies.length} comment replies`);

  // Create pending friend requests
  console.log('⏳ Creating pending friend requests...');
  const pendingRequests: any[] = [];
  for (let i = 0; i < 10; i++) {
    const user1 = createdUsers[Math.floor(Math.random() * createdUsers.length)];
    const user2 = createdUsers[Math.floor(Math.random() * createdUsers.length)];
    
    if (user1.id !== user2.id) {
      try {
        const request = await prisma.friendship.create({
          data: {
            userId: user1.id,
            friendId: user2.id,
            status: 'PENDING',
          },
        });
        pendingRequests.push(request);
      } catch (error) {
        // Ignore duplicates
      }
    }
  }
  console.log(`✅ Created ${pendingRequests.length} pending friend requests`);

  console.log('\n📊 Seed Summary:');
  console.log(`   Users: ${createdUsers.length}`);
  console.log(`   Friendships: ${friendships.length} (+ ${pendingRequests.length} pending)`);
  console.log(`   Posts: ${createdPosts.length}`);
  console.log(`   Likes: ${createdLikes.length}`);
  console.log(`   Comments: ${createdComments.length}`);
  console.log(`   Replies: ${replies.length}`);

  console.log('\n🔑 Test Accounts (password: password123):');
  createdUsers.slice(0, 5).forEach((user: any) => {
    console.log(`   ${user.email} (@${user.username})`);
  });

  console.log('\n✅ Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
