// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBmc11Cf_-op_e2HikOKhx2zhlUKN51aew",
    authDomain: "careerflow-app.firebaseapp.com",
    projectId: "careerflow-app",
    storageBucket: "careerflow-app.firebasestorage.app",
    messagingSenderId: "616353508218",
    appId: "1:616353508218:web:f9ca9d3d028fd6b7b484c3",
    measurementId: "G-V8RW33STR9"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const provider = new firebase.auth.GoogleAuthProvider();

// Make Firebase services available globally
window.firebase = {
    auth: auth,
    db: db,
    provider: provider,
    signInWithPopup: auth.signInWithPopup.bind(auth),
    signOut: auth.signOut.bind(auth),
    onAuthStateChanged: auth.onAuthStateChanged.bind(auth),
    collection: db.collection.bind(db),
    doc: db.doc.bind(db),
    setDoc: (docRef, data) => docRef.set(data),
    getDoc: (docRef) => docRef.get(),
    getDocs: (query) => query.get(),
    deleteDoc: (docRef) => docRef.delete(),
    onSnapshot: (query, callback) => query.onSnapshot(callback),
    serverTimestamp: firebase.firestore.FieldValue.serverTimestamp
}; 