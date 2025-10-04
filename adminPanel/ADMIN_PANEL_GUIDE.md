# Admin Panel Guide - CellSpot

## 🔐 Admin Access

### How to Access
1. Open your browser
2. Go to: `yourwebsite.com/admin.html`
3. Login with admin credentials

### Admin Accounts
| Username | Password | Name |
|----------|----------|------|
| sarikomutan | BlondeMan123 | Sari Komutan |
| Abdulghani | Realmadred1$ | Abdulghani |
| Saker | Realmadred1$ | Saker |

---

## 📊 Dashboard

### Features:
- **Today's Orders**: Count of orders received today
- **Pending Orders**: Orders waiting for approval
- **Today's Revenue**: Total revenue from today's orders
- **Total Users**: Number of registered customers
- **Recent Orders**: Last 5 orders
- **Service Type Distribution**: Chart showing orders by service type

### What You Can Do:
- View quick statistics
- Monitor recent activity
- Click "View All" to go to Orders page

---

## 🛒 Order Management

### Features:
- View all orders with filters
- Approve or reject pending orders
- Search by phone number
- Filter by date, status, and service type

### How to Manage Orders:

#### 1. **View Orders**
- Orders are shown by default for today
- Use filters to find specific orders:
  - **Date Filter**: Today, Yesterday, This Week, This Month, All Time
  - **Status**: All, Pending, Approved, Rejected
  - **Service Type**: Closed u-share, Alfa Gift, Credits, Validity
  - **Search**: Enter phone number

#### 2. **Approve an Order**
- Find the pending order
- Click "Approve" button
- Confirm the action
- Order status changes to "Approved"

#### 3. **Reject an Order**
- Find the pending order
- Click "Reject" button
- Enter rejection reason (optional)
- Order status changes to "Rejected"

### Order Information Displayed:
- Date & Time
- User Name
- Service Type
- Quantity (GB or Credits)
- Price
- Phone Number
- Status
- Actions (Approve/Reject for pending orders)

---

## 📦 Package Management

### Features:
- Add new packages
- Edit existing packages
- Delete packages
- Enable/disable packages
- Manage packages for all service types

### How to Manage Packages:

#### 1. **Add a New Package**
- Go to "Packages" tab
- Select service type (Closed u-share, Open u-share, Alfa Gift, Credits, Validity)
- Click "Add Package" button
- Fill in the form:
  - **Service Type**: Select the service
  - **Package Size**: Enter GB amount (e.g., 5.5, 11, 22)
  - **Price**: Enter price in LBP (e.g., 540000)
  - **Active**: Check to make it visible to customers
- Click "Save Package"

#### 2. **Edit a Package**
- Select service type tab
- Find the package you want to edit
- Click "Edit" button
- Modify the details
- Click "Save Package"

#### 3. **Delete a Package**
- Select service type tab
- Find the package you want to delete
- Click "Delete" button
- Confirm deletion
- Package is permanently removed

#### 4. **Enable/Disable a Package**
- Edit the package
- Check or uncheck "Active" checkbox
- Save changes
- Inactive packages won't show to customers

### Package Types:
- **Closed u-share Service**: Regular data packages
- **Open u-share Service**: Open network packages
- **Alfa Gift**: Gift packages
- **Credits**: Credit packages (no size/price needed)
- **Validity**: Validity extensions (no size/price needed)

---

## 👥 User Management

### Features:
- View all registered users
- Search users by name, email, or phone
- See user balance and order count
- View user's order history

### User Information Displayed:
- Full Name
- Email Address
- Phone Number
- Account Balance (LBP)
- Registration Date
- Total Orders Count

### How to Use:
1. Go to "Users" tab
2. Use search box to find specific users
3. Click "View Orders" to see user's order history
4. Click "Refresh" to update the list

---

## ⚙️ Settings

### Features:
- Configure WhatsApp number
- Set transfer number and service name
- Manage promo codes
- View admin accounts

### How to Configure:

#### 1. **WhatsApp Settings**
- Enter WhatsApp number (with country code)
- Format: `96103475704` (no + or spaces)
- Click "Save WhatsApp Settings"
- All customer messages will go to this number

#### 2. **Transfer Settings**
- **Transfer Number**: The number customers transfer money to (e.g., 71829887)
- **Transfer Service Name**: The service name (e.g., WISH MONEY)
- Click "Save Transfer Settings"
- These appear on all purchase pages

#### 3. **Promo Code Settings**
- **Active Promo Code**: The code customers can use (e.g., Aboud)
- **Discount Percentage**: Discount amount (e.g., 10 for 10% off)
- Click "Save Promo Code"
- Customers can use this code for discounts

#### 4. **Admin Accounts**
- View list of admin accounts
- All three admins are active
- To modify accounts, contact the developer

---

## 🔄 Daily Workflow

### Morning Routine:
1. Login to admin panel
2. Check Dashboard for overnight orders
3. Go to Orders tab
4. Review pending orders
5. Approve legitimate orders
6. Reject suspicious orders

### Throughout the Day:
1. Monitor new orders as they come in
2. Respond to customer WhatsApp messages
3. Approve orders after verifying transfer proof
4. Check statistics on Dashboard

### Adding New Packages:
1. Go to Packages tab
2. Select service type
3. Click "Add Package"
4. Enter size and price
5. Make it active
6. Customers see it immediately

### Updating Prices:
1. Go to Packages tab
2. Find the package
3. Click "Edit"
4. Change the price
5. Save
6. New price applies immediately

---

## 💡 Tips & Best Practices

### Order Management:
- ✅ Always verify transfer proof on WhatsApp before approving
- ✅ Check phone numbers match the transfer proof
- ✅ Use rejection reason to communicate with customers
- ✅ Review orders daily to avoid delays

### Package Management:
- ✅ Keep package sizes consistent (5.5, 11, 22, etc.)
- ✅ Update prices regularly based on costs
- ✅ Disable packages instead of deleting them (keeps history)
- ✅ Test new packages before making them active

### Security:
- ✅ Never share admin credentials
- ✅ Logout when done
- ✅ Use strong passwords
- ✅ Only access admin panel from secure devices

### Customer Service:
- ✅ Approve orders quickly (within hours)
- ✅ Provide clear rejection reasons
- ✅ Keep WhatsApp number updated
- ✅ Monitor pending orders regularly

---

## 🚨 Troubleshooting

### Can't Login?
- Check username and password (case-sensitive)
- Make sure you're on `/admin.html` page
- Clear browser cache and try again

### Orders Not Showing?
- Check date filter (set to "All Time")
- Clear status and type filters
- Click "Refresh" button

### Packages Not Appearing for Customers?
- Make sure package is marked as "Active"
- Check that size and price are filled in
- Refresh customer site

### Settings Not Saving?
- Check internet connection
- Make sure all fields are filled correctly
- Try again after a few seconds

---

## 📱 Mobile Access

The admin panel is fully responsive and works on:
- Desktop computers
- Laptops
- Tablets
- Mobile phones

Just open `yourwebsite.com/admin.html` on any device!

---

## 🆘 Support

If you need help:
1. Check this guide first
2. Try refreshing the page
3. Clear browser cache
4. Contact the developer

---

## 🔒 Security Notes

- Admin panel is separate from customer site
- Only people with credentials can access
- All actions are logged with admin username
- Session expires when you logout

---

**Remember**: You now have full control of the website without touching any code! 🎉
