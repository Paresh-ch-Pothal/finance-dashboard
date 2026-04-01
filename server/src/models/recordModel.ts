import {Schema,model,Document} from 'mongoose';

export interface Irecord extends Document{
    createdBy: Schema.Types.ObjectId,
    type: 'Income' | 'Expense',
    amount: number,
    category: string,
    date: Date,
    description?: string
}


const recordSchema = new Schema<Irecord>({
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['Income', 'Expense'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    description: {
        type: String
    }
},{timestamps: true})

const recordModel = model<Irecord>('Record',recordSchema)
export default recordModel