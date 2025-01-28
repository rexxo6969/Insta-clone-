// Paste your Firebase config here
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Auth functions
function signUp() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  auth.createUserWithEmailAndPassword(email, password)
    .then(() => alert('Signed up!'))
    .catch(error => alert(error.message));
}

function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      document.getElementById('auth-section').style.display = 'none';
      document.getElementById('app').style.display = 'block';
      loadFeed();
    })
    .catch(error => alert(error.message));
}

// Upload post with image
function uploadPost() {
  const file = document.getElementById('imageUpload').files[0];
  const storageRef = storage.ref('posts/' + file.name);
  storageRef.put(file).then((snapshot) => {
    snapshot.ref.getDownloadURL().then((url) => {
      db.collection('posts').add({
        imageUrl: url,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        likes: 0,
        userId: auth.currentUser.uid
      });
    });
  });
}

// Load feed
function loadFeed() {
  db.collection('posts').orderBy('timestamp', 'desc').onSnapshot((snapshot) => {
    const feed = document.getElementById('feed');
    feed.innerHTML = '';
    snapshot.forEach(doc => {
      const post = doc.data();
      feed.innerHTML += `
        <div class="post">
          <img src="${post.imageUrl}">
          <p>Likes: ${post.likes}</p>
        </div>
      `;
    });
  });
}