
import Transaction from "../models/Transaction.js";
import sequelize from "../db.js";
import Member from "../models/Member.js";


export const transactionDetails = async (req, res) => {
    const t = await sequelize.transaction(); // Start the transaction

    try {
        const { contactNumber,
            licensePlate,
            firstName,
            lastName,
            cardNo,
            userId,
            locationId } = req.body;
            let vehicleDetails = ''
            if(licensePlate == 'ABC001'){
                 vehicleDetails = {"make": "bmw", "type": "Petrol", "color": "Silver", "model": "Elantra"}
            }
            if(licensePlate == 'DEF001'){
                vehicleDetails = {"make": "kia", "type": "Petrol", "color": "Silver", "model": "Elantra"}

            }
            

        const newTransaction = await Transaction.create({
            vehicleNumber: licensePlate,
            memberId: userId,
            locationId,
            entryTime: new Date(),
            cardDetails: cardNo,
            vehicleDetails : vehicleDetails
        }, { transaction: t }); // Associate transaction with create
        await t.commit(); // Commit the transaction only if both succeed

        res.status(200).json({
            message: 'Transaction and Member created successfully',
            data: { transaction: newTransaction.toJSON() } // Send back data
        });
    } catch (error) {

        console.error("Error creating transaction and/or member:", error);
        res.status(500).json({ message: 'Error processing request', error: error.message });
    }
};