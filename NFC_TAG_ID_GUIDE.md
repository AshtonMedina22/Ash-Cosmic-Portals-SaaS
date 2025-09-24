# 🔍 How to Get Your NFC Tag ID

## **📱 Method 1: NFC Tools App (Easiest)**

### **Step 1: Download NFC Tools**
- **iPhone**: Download "NFC Tools" from App Store
- **Android**: Download "NFC Tools" from Google Play Store

### **Step 2: Read Your Keychain**
1. Open NFC Tools app
2. Tap "Read" tab
3. Hold your Party Time Texas keychain close to your phone
4. The app will read the NFC tag and show you the **Tag ID**
5. **Copy the Tag ID** (it will look like: `04:12:34:56:78:90:AB`)

### **Step 3: Register in Cosmic Portals**
1. Go to your dashboard: `http://192.168.0.178:3000/dashboard/devices`
2. Click "Add Device" or "Register New Device"
3. Enter the Tag ID you just read
4. Set device type as "business_card"
5. Add your Party Time Texas metadata

---

## **📱 Method 2: TagWriter by NXP**

### **Step 1: Download TagWriter**
- **iPhone**: Download "TagWriter by NXP" from App Store
- **Android**: Download "TagWriter by NXP" from Google Play Store

### **Step 2: Read Your Keychain**
1. Open TagWriter app
2. Tap "Read" button
3. Hold your keychain to your phone
4. Look for "Tag UID" or "Tag ID" in the results
5. **Copy the Tag ID**

---

## **📱 Method 3: Android Built-in NFC**

### **Step 1: Enable NFC**
1. Go to Settings → Connected devices → Connection preferences
2. Turn on "NFC"

### **Step 2: Use NFC Service**
1. Go to Settings → Apps → NFC Service
2. Tap "Test NFC" or "Read NFC"
3. Hold your keychain to your phone
4. Look for the Tag ID in the results

---

## **🔧 Method 4: Use a Different Phone**

### **If your phone doesn't read NFC:**
1. **Ask a friend** with an Android phone to use NFC Tools
2. **Use a different device** that supports NFC reading
3. **Visit a phone store** and ask them to read your NFC tag

---

## **📋 What the Tag ID Looks Like**

### **Common Formats:**
- `04:12:34:56:78:90:AB` (7-byte UID)
- `04:12:34:56:78:90` (6-byte UID)
- `041234567890AB` (hexadecimal)
- `04 12 34 56 78 90 AB` (spaced format)

### **Important Notes:**
- ✅ **Tag ID is unique** - each NFC tag has a different ID
- ✅ **Tag ID never changes** - it's burned into the chip
- ✅ **Tag ID is required** for analytics tracking
- ✅ **Without Tag ID** - you can't track which specific keychain was scanned

---

## **🚀 After Getting Your Tag ID**

### **Step 1: Register in Cosmic Portals**
1. Go to: `http://192.168.0.178:3000/dashboard/devices`
2. Click "Add Device" or "Register New Device"
3. Enter your Tag ID
4. Set device type: "business_card"
5. Add metadata:
   - Name: "Party Time Texas Keychain"
   - Description: "Official Party Time Texas keychain"
   - Assigned to: "Ashton Medina"
   - Contact email: "ashton@partytimetexas.com"

### **Step 2: Update Your Keychain**
1. **Keep your existing keychain** pointing to `https://lnk.bio/PartyTimeTexas`
2. **Add analytics tracking** by updating the URL to include your Tag ID
3. **New URL format**: `https://lnk.bio/PartyTimeTexas?nfc_id=YOUR_TAG_ID`

### **Step 3: Test Analytics**
1. Scan your keychain
2. Check dashboard for scan data
3. Verify analytics are being tracked
4. Monitor real-time engagement

---

## **💡 Pro Tips**

### **Why You Need the Tag ID:**
- **Individual tracking** - know which specific keychain was scanned
- **Analytics accuracy** - track engagement per device
- **ROI measurement** - measure effectiveness of each keychain
- **Geographic data** - see where each keychain gets scanned

### **Alternative Approach:**
If you can't get the Tag ID, you can still track analytics by:
1. **Creating a unique URL** for each keychain
2. **Using UTM parameters** to track which keychain was scanned
3. **Adding device metadata** to identify each keychain

---

## **🔧 Troubleshooting**

### **Common Issues:**
1. **Phone doesn't read NFC** - try a different phone or app
2. **Tag ID not showing** - make sure NFC is enabled
3. **Multiple Tag IDs** - some keychains have multiple chips
4. **Tag ID format** - copy exactly as shown, including colons

### **Support:**
- Try different NFC reading apps
- Use a friend's phone with NFC
- Visit a phone store for assistance
- Contact NFC manufacturer for Tag ID

---

**🎯 Once you have your Tag ID, you'll be able to track real analytics from your Party Time Texas keychain!**
