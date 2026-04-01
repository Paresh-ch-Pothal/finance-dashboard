import {Schema,Document, model} from 'mongoose'

export interface Iuser extends Document{
    name: string,
    email: string,
    password: string,
    role: "Viewer" | "Analyst" | "Admin",
    isActive: boolean
}


const userSchema = new Schema<Iuser>({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role:{
        type: String,
        enum: ["Viewer", "Analyst", "Admin"],
        default: "Viewer"
    },
    isActive:{
        type: Boolean,
        default: true
    }
},{
    timestamps: true
})

const userModel = model<Iuser>('User',userSchema)
export default userModel