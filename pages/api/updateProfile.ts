import { NextApiRequest, NextApiResponse } from 'next';
import Airtable from 'airtable';
import bcrypt from 'bcrypt';

const base = new Airtable({ apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY }).base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { userId, userName, email, userAvatar, password } = req.body;

    try {
      if (!userId) {
        return res.status(400).json({ success: false, message: 'User ID is required.' });
      }

      // Dynamically construct the updates object
      const updates: any = {};

      if (userName) updates.userName = userName;
      if (email) updates.Email = email;
      if (userAvatar) updates.userAvatar = userAvatar;

      if (password) {
        // Hash the password if provided
        updates.Password = await bcrypt.hash(password, 10); // Hash the password with 10 salt rounds
      }

      // Update the user in Airtable
      await base('userTable').update(userId, updates );

      return res.status(200).json({ success: true, message: 'User updated successfully!' });
    } catch (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({ success: false, message: 'Internal server error.' + error});
    }
  } else {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
}
