# EZ ESPORTS - Dynamic Website (Upgraded)

## 🎯 Overview
Your EZ ESPORTS website is now **fully dynamic** and controlled through the Admin Panel! All content can be edited without touching the code.

## 📁 File Structure
```
/index.html          - Home page (dynamic content loaded from localStorage)
/squad.html          - Team roster (loads players from localStorage)
/tournaments.html    - Tournament list and leaderboards
/admin.html          - Admin panel with Site Editor, Squad Manager, Tournaments
/css/style.css       - Complete styling
/js/app.js           - Dynamic content loading & navigation
/js/admin.js         - Admin panel functionality
/js/leaderboard.js   - Leaderboard calculations
```

## 🚀 Getting Started

### Step 1: Open the Website
1. Open `index.html` in your browser
2. The site will load with default content

### Step 2: Access Admin Panel
1. Click "ADMIN" in the navigation menu
2. Login with credentials:
   - **Username:** `admin`
   - **Password:** `admin123`

## ⚙️ Admin Panel Features

### 🎨 SITE EDITOR TAB

#### Edit Home Page
Control all text on your home page:
- **Team Name (Main):** e.g., "EZ"
- **Team Name (Secondary):** e.g., "ESPORTS"
- **Hero Title Line 1 & 2:** Main title on homepage
- **Hero Subtitle:** Tagline below title
- **Established Year:** When team was founded
- **First Match Date:** Date of first tournament
- **Team Logo URL:** (Optional) Add your team logo

**How to add images:**
1. Upload your image to [Imgur](https://imgur.com), Discord, or Pinterest
2. Right-click the image → "Copy Image Address"
3. Paste the URL in the form
4. Click "SAVE HOME PAGE SETTINGS"

#### Social Media Links
Add your team's social media:
- Twitter URL
- Instagram URL
- YouTube URL
- Discord URL

Links will automatically update in the footer on all pages.

#### About Section
Edit the two paragraphs that describe your team on the home page.

### 👥 SQUAD MANAGER TAB

#### Add New Player
Create player profiles with:
- **Player Name:** Full name
- **In-Game Name (IGN):** Player's gaming tag
- **Role:** IGL, Assaulter, Support, or Sniper
- **Status:** Active, Inactive, or Substitute
- **Profile Image URL:** Player photo (upload to Imgur/Discord/Pinterest)
- **Twitter URL:** Player's Twitter (optional)
- **Instagram URL:** Player's Instagram (optional)

**Adding Player Photos:**
1. Find or create a player photo
2. Upload to [Imgur](https://imgur.com) → Upload Image
3. Right-click uploaded image → Copy Image Address
4. Paste URL in "Profile Image URL" field
5. If URL fails, player's initial will display instead

#### Edit/Delete Players
- **EDIT:** Click to modify player details
- **DELETE:** Remove player from roster
- Changes appear instantly on Squad page

### 🏆 TOURNAMENTS TAB

#### Create Tournament
Same as before, but now with EDIT capability:
- Tournament Name
- Date
- Total Matches

#### Edit/Delete Tournaments
- **EDIT:** Update tournament details
- **DELETE:** Remove tournament and all its match data

### 🎮 ADD MATCH DATA TAB
Same functionality as before:
- Select tournament
- Enter match number, team, placement, points
- Data saves to leaderboard

## 💾 How Dynamic Content Works

### On Page Load
When you open any page, JavaScript automatically:
1. Checks `localStorage` for saved settings
2. Loads custom team name, hero text, social links
3. Displays player roster from Squad Manager
4. Updates all dynamic content across the site

### localStorage Structure
All data is stored in your browser's localStorage:
- `siteSettings` - Home page content
- `socialLinks` - Social media URLs
- `squad` - Player roster
- `tournaments` - Tournament list
- `matches` - Match data

### Default Content
The first time you visit:
- Default EZ ESPORTS branding loads
- Original 4 players appear (Mubashir, Rehan, Abdul Wassay, Hashir)
- You can edit or delete these and add new players

## 🖼️ Image URL Guide

### Best Free Image Hosting Services

#### 1. Imgur (Recommended)
- Go to [imgur.com](https://imgur.com)
- Click "New Post"
- Upload image
- Right-click → "Copy Image Address"
- Paste in your form

#### 2. Discord
- Open Discord
- Upload image to any channel
- Right-click → "Copy Link"
- Paste in your form

#### 3. Pinterest
- Upload to Pinterest
- Right-click image → "Copy Image Address"
- Paste in your form

**Important:** Always copy the **direct image URL** (ends with .png, .jpg, .jpeg, .webp)

## 🔄 Real-Time Updates

### What Updates Automatically:
- ✅ Navbar team name (all pages)
- ✅ Hero section title and subtitle (home page)
- ✅ Team statistics (home page)
- ✅ About section text (home page)
- ✅ Footer social links (all pages)
- ✅ Squad roster (squad page)
- ✅ Player count in stats

### How to See Changes:
1. Edit content in Admin Panel
2. Click "Save" button
3. Refresh the page you want to view
4. Your changes appear instantly!

## 📱 Responsive Design
All pages work perfectly on:
- Desktop computers
- Tablets
- Mobile phones

## 🎯 Tips for Best Results

### Images
- Use high-quality images (at least 800x800px for players)
- Square images work best for player photos
- Make sure image URLs are publicly accessible
- Test your image URL by pasting it in a new browser tab

### Text Content
- Keep hero subtitle under 60 characters for best display
- Write clear, engaging about paragraphs
- Use professional language for team description

### Social Links
- Always include https:// in URLs
- Verify links work before saving
- Leave fields empty if you don't have that social media

### Squad Management
- Arrange players in order of importance (IGL first recommended)
- Keep IGNs short and memorable
- Update player status when needed

## 🔒 Data Persistence
- All data is stored in browser's localStorage
- Data persists across sessions
- Data is local to your browser
- To reset: Clear browser data for the site

## 🐛 Troubleshooting

### Images Not Loading?
- Check if image URL is publicly accessible
- Paste URL directly in browser to test
- Make sure URL ends with .jpg, .png, .jpeg, or .webp
- Try re-uploading to Imgur

### Changes Not Appearing?
- Make sure you clicked "Save" button
- Refresh the page (Ctrl+F5 or Cmd+Shift+R)
- Check browser console for errors (F12)

### Lost Your Data?
- Data is stored in browser's localStorage
- Clearing browser data will delete settings
- Use same browser to maintain data
- Consider exporting localStorage manually

## 🎨 Customization Beyond Admin Panel

Want to change colors or fonts?
1. Open `css/style.css`
2. Edit CSS variables at the top:
   - `--primary-red`: Main red color
   - `--black`: Background color
   - `--font-display`: Display font
   - `--font-body`: Body text font

## 📞 Support

If you need help:
1. Check this README first
2. Review browser console (F12) for errors
3. Verify all URLs are correct and accessible
4. Test in different browsers

## 🎉 Features Summary

✨ **New Dynamic Features:**
- Full home page customization
- Complete squad management with images
- Social media integration
- Real-time content updates
- Edit/Delete functionality for all content
- Image URL support (no backend needed)
- Persistent data storage

🏆 **Original Features:**
- Tournament management
- Match data entry
- PUBG point system calculations
- Leaderboard rankings
- Professional esports design
- Mobile responsive

---

**Made for EZ ESPORTS** | Professional PUBG Esports Team | EST. 2026
