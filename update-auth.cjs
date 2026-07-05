const fs = require('fs');
let code = fs.readFileSync('src/components/AuthView.tsx', 'utf8');

const targetGoogle = `        profile = {
          id: user.uid,
          email: user.email || '',
          name: user.displayName || 'Google User',
          role: 'owner',
          storeId: newStoreId
        };`;

const replacementGoogle = `        profile = {
          id: user.uid,
          email: user.email || '',
          name: user.displayName || 'Google User',
          role: user.email === 'jessicahair60@gmail.com' ? 'admin' : 'owner',
          storeId: newStoreId
        };`;

const targetEmail = `        const newUser: AppUser = {
          id: userCredential.user.uid,
          email: email,
          name: name,
          role: 'owner',
          storeId: newStoreId
        };`;

const replacementEmail = `        const newUser: AppUser = {
          id: userCredential.user.uid,
          email: email,
          name: name,
          role: email === 'jessicahair60@gmail.com' ? 'admin' : 'owner',
          storeId: newStoreId
        };`;

const targetLogin = `        let profile = await getUserProfile(userCredential.user.uid);
        if (profile) {
          onLoginSuccess(profile);
        }`;

const replacementLogin = `        let profile = await getUserProfile(userCredential.user.uid);
        if (profile) {
          if (profile.email === 'jessicahair60@gmail.com' && profile.role !== 'admin') {
            profile.role = 'admin';
            await saveUserProfile(profile);
          }
          onLoginSuccess(profile);
        }`;
        
const targetGoogleLogin = `      let profile = await getUserProfile(user.uid);
      if (!profile) {`;

const replacementGoogleLogin = `      let profile = await getUserProfile(user.uid);
      if (profile && profile.email === 'jessicahair60@gmail.com' && profile.role !== 'admin') {
         profile.role = 'admin';
         await saveUserProfile(profile);
      }
      if (!profile) {`;

let modified = false;

if (code.includes(targetGoogle)) {
    code = code.replace(targetGoogle, replacementGoogle);
    modified = true;
}
if (code.includes(targetEmail)) {
    code = code.replace(targetEmail, replacementEmail);
    modified = true;
}
if (code.includes(targetLogin)) {
    code = code.replace(targetLogin, replacementLogin);
    modified = true;
}
if (code.includes(targetGoogleLogin)) {
    code = code.replace(targetGoogleLogin, replacementGoogleLogin);
    modified = true;
}

if (modified) {
    fs.writeFileSync('src/components/AuthView.tsx', code);
    console.log("Success");
} else {
    console.log("Not found target");
}
