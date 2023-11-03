import { User as FirebaseUser} from "../config/firebaseConfig"

export interface User {
    loggedIn: boolean
    data: FirebaseUser | null
}