const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();


app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0i6hrz5.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {

        await client.connect();
        const serviceCollection = client.db('freelancerDB').collection('services');
        const freelancerCollection = client.db('freelancerDB').collection('freelancers');
        const clientCollection = client.db('freelancerDB').collection('clients');
        const orderCollection = client.db('freelancerDB').collection('orders');
        const reviewCollection = client.db('freelancerDB').collection('reviews');
        const withdrawCollection = client.db('freelancerDB').collection('withdraws');
        const transactionCollection = client.db('freelancerDB').collection('transactions');

        app.get('/service', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service)
        });

        app.post('/service', async (req, res) => {
            const newService = req.body;
            const result = await serviceCollection.insertOne(newService);
            res.send(result);
        });

        app.get('/myservice', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = serviceCollection.find(query);
            const myService = await cursor.toArray();
            res.send(myService);
        });
        app.get('/userservice', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = serviceCollection.find(query);
            const userService = await cursor.toArray();
            res.send(userService);
        });

        app.get('/userservice/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const userService = await serviceCollection.findOne(query);
            res.send(userService)
        });

        app.put('/service/:id', async (req, res) => {
            const id = req.params.id;
            const publishStatus = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    publishStatus: publishStatus.status,
                   
                }
            };

            const result = await serviceCollection.updateOne(filter, updatedDoc, options);
            res.send(result);

        });

        /**
         * Freelancer Profile
        **/
        app.post('/freelancers', async (req, res) => {
            const newFreelancer = req.body;
            const result = await freelancerCollection.insertOne(newFreelancer);
            res.send(result);
        });
        

        app.get('/freelancers', async (req, res) => {
            const query = {};
            const cursor = freelancerCollection.find(query);
            const freelancers = await cursor.toArray();
            res.send(freelancers);
        });

        app.get('/freelancer/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const freelancer = await freelancerCollection.findOne(query);
            res.send(freelancer)
        });

        app.get('/freelancerprofile', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = freelancerCollection.find(query);
            const freelancerprofile = await cursor.toArray();
            res.send(freelancerprofile);
        });


        /*****
         * Client Profile
         * ****/

         app.post('/clients', async (req, res) => {
            const newClient = req.body;
            const result = await clientCollection.insertOne(newClient);
            res.send(result);
        });

        app.get('/clients', async (req, res) => {
            const query = {};
            const cursor = clientCollection.find(query);
            const clients = await cursor.toArray();
            res.send(clients);
        });

        app.get('/client/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const client = await clientCollection.findOne(query);
            res.send(client)
        });

        app.get('/clientprofile', async (req, res) => {
            const email = req.query.clientEmail;
            const query = { clientEmail: email };
            const cursor = clientCollection.find(query);
            const clientprofile = await cursor.toArray();
            res.send(clientprofile);
        });

        /*******
         * Orders
         * ****** */

        app.post('/orders', async (req, res) => {
            const newOrders = req.body;
            const result = await orderCollection.insertOne(newOrders);
            res.send(result);
        });

        app.get('/orders', async (req, res) => {
            const query = {};
            const cursor = orderCollection.find(query);
            const orders = await cursor.toArray();
            res.send(orders);
        });
        app.get('/myorder/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const myOrder = await orderCollection.findOne(query);
            res.send(myOrder)
        });

        app.get('/myorder', async (req, res) => {
            const email = req.query.email;
            const query = { customeremail: email };
            const cursor = orderCollection.find(query);
            const myOrder = await cursor.toArray();
            res.send(myOrder);
        });

        app.get('/myserviceorder', async (req, res) => {
            const email = req.query.email;
            const query = { provideremail: email };
            const cursor = orderCollection.find(query);
            const myServiceOrder = await cursor.toArray();
            res.send(myServiceOrder);
        });

        app.get('/myserviceorder/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const myServiceOrder = await orderCollection.findOne(query);
            res.send(myServiceOrder)
        });

        app.put('/myserviceorder/:id', async (req, res) => {
            const id = req.params.id;
            const updateStatus = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    status: updateStatus.status,
                    releaseStatus: updateStatus.release,

                }
            };

            const result = await orderCollection.updateOne(filter, updatedDoc, options);
            res.send(result);

        });
        app.put('/myserviceorderrequirement/:id', async (req, res) => {
            const id = req.params.id;
            const requirementStatus = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    providerSaid: requirementStatus.requirement,
                    reqUpdated: requirementStatus.providerReq,
 
                }
            };

            const result = await orderCollection.updateOne(filter, updatedDoc, options);
            res.send(result);

        });
        app.put('/myorder/:id', async (req, res) => {
            const id = req.params.id;
            const updateStatus = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    status: updateStatus.status,
                }
            };

            const result = await orderCollection.updateOne(filter, updatedDoc, options);
            res.send(result);

        });


        app.put('/myreviewfororder/:id', async (req, res) => {
            const id = req.params.id;
            const reviewData = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    reviewStatus: reviewData.reviewStatus,
                    rate: reviewData.rate,
                    review: reviewData.review,
                }
            };

            const result = await orderCollection.updateOne(filter, updatedDoc, options);
            res.send(result);

        });
        app.put('/myreviewformyservice/:id', async (req, res) => {
            const id = req.params.id;
            const review = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    providerReviewStatus: review.providerReviewStatus,
                    providerRate: review.providerrate,
                    providerReview: review.providerreview,
                }
            };

            const result = await orderCollection.updateOne(filter, updatedDoc, options);
            res.send(result);

        });

        app.put('/releasepayment/:id', async (req, res) => {
            const id = req.params.id;
            const releaseStatus = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    releaseStatus: releaseStatus.release,
                    releaseAmount: releaseStatus.releaseAmount,
                }
            };

            const result = await orderCollection.updateOne(filter, updatedDoc, options);
            res.send(result);

        });

        /***
         * 
         * Withdraw Funds
         * 
         * **** */

        app.post('/withdraw', async (req, res) => {
            const newWithdraw = req.body;
            const result = await withdrawCollection.insertOne(newWithdraw);
            res.send(result);
        });

        app.get('/withdraw', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = withdrawCollection.find(query);
            const myWithdraw = await cursor.toArray();
            res.send(myWithdraw);
        });

        app.get('/withdraws', async (req, res) => {
            const query = {};
            const cursor = withdrawCollection.find(query);
            const allWithdraws = await cursor.toArray();
            res.send(allWithdraws);
        });

        app.get('/withdraw/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const withdrawal = await withdrawCollection.findOne(query);
            res.send(withdrawal)
        });

        app.put('/withdraw/:id', async (req, res) => {
            const id = req.params.id;
            const withdrawStatus = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    status: withdrawStatus.status,

                }
            };

            const result = await withdrawCollection.updateOne(filter, updatedDoc, options);
            res.send(result);

        });


        /****
         * 
         * TransactionCollection
         * 
         * ****/

        app.get('/freelancertransaction', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = transactionCollection.find(query);
            const freelancertransaction = await cursor.toArray();
            res.send(freelancertransaction);
        });

        app.post('/freelancertransactions', async (req, res) => {
            const newTransactions = req.body;
            const result = await transactionCollection.insertOne(newTransactions);
            res.send(result);
        });

       
        /*******
         * 
         * Reviews
         * 
         * *****/


        app.post('/reviews', async (req, res) => {
            const newReview = req.body;
            const result = await reviewCollection.insertOne(newReview);
            res.send(result);
        });


        app.get('/reviews', async (req, res) => {
            const query = {};
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

        app.get('/providerreview', async (req, res) => {
            const id = req.query.serviceId;
            const query = { serviceId: id };
            const cursor = orderCollection.find(query);
            const myServiceReview = await cursor.toArray();
            res.send(myServiceReview);
        });
        app.get('/clientreview', async (req, res) => {
            const id = req.query.serviceId;
            const query = { serviceId: id };
            const cursor = orderCollection.find(query);
            const myServiceReview = await cursor.toArray();
            res.send(myServiceReview);
        });

        app.get('/providerprofilereview', async (req, res) => {
            const email = req.query.provideremail;
            const query = { provideremail: email };
            const cursor = orderCollection.find(query);
            const providerProfileReview = await cursor.toArray();
            res.send(providerProfileReview);
        });
        app.get('/clientprofilereview', async (req, res) => {
            const email = req.query.customeremail;
            const query = { customeremail: email };
            const cursor = orderCollection.find(query);
            const clientProfileReview = await cursor.toArray();
            res.send(clientProfileReview);
        });

    }
    finally {

    }

}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Freelancing Marketplace Server');
});

app.listen(port, () => {
    console.log('Listing to Port', port);
})