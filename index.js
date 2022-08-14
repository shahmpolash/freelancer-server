const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
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
        const messageCollection = client.db('freelancerDB').collection('messages');
        const replyMessageCollection = client.db('freelancerDB').collection('replies');
        const adminCollection = client.db('freelancerDB').collection('admins');
        const paymentsettingCollection = client.db('freelancerDB').collection('paymentsetting');
        const contactCollection = client.db('freelancerDB').collection('contact');
        const footerCollection = client.db('freelancerDB').collection('footer');
        const aboutCollection = client.db('freelancerDB').collection('about');

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
        app.put('/service-unpublish/:id', async (req, res) => {
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

        app.put('/service-edit/:id', async (req, res) => {
            const id = req.params.id;
            const serviceUpdate = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    title: serviceUpdate.title,
                    price: serviceUpdate.price,
                    img: serviceUpdate.img,
                    details: serviceUpdate.details,
                   
                }
            };

            const result = await serviceCollection.updateOne(filter, updatedDoc, options);
            res.send(result);

        });


        /****
         * Admin Account
         * ****/

         app.post('/admin', async (req, res) => {
            const newAdmin = req.body;
            const result = await adminCollection.insertOne(newAdmin);
            res.send(result);
        });
        app.get('/admin', async (req, res) => {
            const query = {};
            const cursor = adminCollection.find(query);
            const admin = await cursor.toArray();
            res.send(admin);
        });
        app.get('/payment-setting', async (req, res) => {
            const query = {};
            const cursor = paymentsettingCollection.find(query);
            const paymentSetting = await cursor.toArray();
            res.send(paymentSetting);
        });

        app.post('/payment-setting', async (req, res) => {
            const paymentSetting = req.body;
            const result = await paymentsettingCollection.insertOne(paymentSetting);
            res.send(result);
        });

        app.get('/payment-setting/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const paymentSetting = await paymentsettingCollection.findOne(query);
            res.send(paymentSetting)
        });


        app.put('/payment-setting/:id', async (req, res) => {
            const id = req.params.id;
            const paymentSettingUpdate = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    paypalEmail: paymentSettingUpdate.paypalEmail,
                    commission: paymentSettingUpdate.commission,
 
                }
            };

            const result = await paymentsettingCollection.updateOne(filter, updatedDoc, options);
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

        app.put('/freelancer/:id', async (req, res) => {
            const id = req.params.id;
            const freelancer = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    name: freelancer.name,
                    heading: freelancer.heading,
                    profile: freelancer.profile,
                    about: freelancer.about,
                    location: freelancer.location,
                    onpageseo: freelancer.onpageseo,
                    offpageseo: freelancer.offpageseo,
                    technicalseo: freelancer.technicalseo,
                    lead: freelancer.lead,
                    social: freelancer.social,
                    experience: freelancer.experience,
                    available: freelancer.available,
                    fb: freelancer.fb,
                    twitter: freelancer.twitter,
                    linkedin: freelancer.linkedin,
                    marketplace: freelancer.marketplace,
                    projectcompleted: freelancer.projectcompleted,
                    totalreviews: freelancer.totalreviews,
                    profilelink: freelancer.profilelink,
                    status: freelancer.status,
                    verifiedStatus: freelancer.verifiedStatus,
 
                }
            };

            const result = await freelancerCollection.updateOne(filter, updatedDoc, options);
            res.send(result);

        });
        app.put('/freelancer-status/:id', async (req, res) => {
            const id = req.params.id;
            const providerApprove = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    status: providerApprove.status,
 
                }
            };

            const result = await freelancerCollection.updateOne(filter, updatedDoc, options);
            res.send(result);

        });
        app.put('/freelancer-verifystatus/:id', async (req, res) => {
            const id = req.params.id;
            const providerApprove = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    
                    verifiedStatus: providerApprove.verifiedStatus,
 
                }
            };

            const result = await freelancerCollection.updateOne(filter, updatedDoc, options);
            res.send(result);

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

        app.put('/client/:id', async (req, res) => {
            const id = req.params.id;
            const client = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    clientName: client.clientName,
                    clientLocation: client.clientLocation,
                    clientAbout: client.clientAbout,
                    clientProfile: client.clientProfile,
                    clientFB: client.clientFB,
                    clientTwitter: client.clientTwitter,
                    clientLinkedin: client.clientLinkedin,
 
                }
            };

            const result = await clientCollection.updateOne(filter, updatedDoc, options);
            res.send(result);

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
                    runningOrCompleted: updateStatus.runningOrFinished,
                    

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
        app.put('/clientorderrequirement/:id', async (req, res) => {
            const id = req.params.id;
            const clientRequirementStatus = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    clientUpdated: clientRequirementStatus.requirement,
                    reqUpdated: clientRequirementStatus.reqUpdated,
 
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
                    runningOrCompleted: updateStatus.runningOrFinished,
                    
                }
            };

            const result = await orderCollection.updateOne(filter, updatedDoc, options);
            res.send(result);

        });
        app.put('/order/:id', async (req, res) => {
            const id = req.params.id;
            const updateStatus = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    status: updateStatus.status,
                    runningOrCompleted: updateStatus.runningOrFinished,
                    release: updateStatus.release,
                    cancelledBy: updateStatus.cancelledBy,
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
                    withdrawnAmount: withdrawStatus.withdrawnAmount,
                    transactionId: withdrawStatus.transactionId,
                    note: withdrawStatus.note,
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


        /****
         * 
         * Messages
         * 
         * ****/
         app.post('/message', async (req, res) => {
            const newMessage = req.body;
            const result = await messageCollection.insertOne(newMessage);
            res.send(result);
        });

        app.get('/messages', async (req, res) => {
            const query = {};
            const cursor = messageCollection.find(query);
            const messages = await cursor.toArray();
            res.send(messages);
        });

        app.get('/message/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const message = await messageCollection.findOne(query);
            res.send(message)
        });


        app.put('/message/:id', async (req, res) => {
            const id = req.params.id;
            const status = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    messageStatus: status.messageStatus,
                }
            };

            const result = await messageCollection.updateOne(filter, updatedDoc, options);
            res.send(result);

        });
      
      
        app.post('/reply', async (req, res) => {
            const newReply = req.body;
            const result = await replyMessageCollection.insertOne(newReply);
            res.send(result);
        });

        app.get('/replies', async (req, res) => {
            const query = {};
            const cursor = replyMessageCollection.find(query);
            const replies = await cursor.toArray();
            res.send(replies);
        });

        app.post('/create-payment-intent' , async(req, res) =>{
            const order = req.body;
            const serviceprice = order.serviceprice;
            const amount = serviceprice*100;
            const paymentIntent = await stripe.paymentIntents.create({
              amount : amount,
              currency: 'usd',
              payment_method_types:['card']
            });
            res.send({clientSecret: paymentIntent.client_secret})
        });

        /*****
         * Contact Page
         * *****/
         app.post('/contact', async (req, res) => {
            const contactPage = req.body;
            const result = await contactCollection.insertOne(contactPage);
            res.send(result);
        });

        app.get('/contact', async (req, res) => {
            const query = {};
            const cursor = contactCollection.find(query);
            const contactPage = await cursor.toArray();
            res.send(contactPage);
        });

        app.get('/contact/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const contact = await contactCollection.findOne(query);
            res.send(contact)
        });

        app.put('/contact/:id', async (req, res) => {
            const id = req.params.id;
            const contactPageUpdate = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    contactBanner: contactPageUpdate.contactBanner,
                    contactText: contactPageUpdate.contactText,
                    contactEmail: contactPageUpdate.contactEmail,
                    contactAddress: contactPageUpdate.contactAddress,
                }
            };

            const result = await contactCollection.updateOne(filter, updatedDoc, options);
            res.send(result);

        });

        /****
         * Footer Setup
         * ****/

         app.post('/footer', async (req, res) => {
            const footer = req.body;
            const result = await footerCollection.insertOne(footer);
            res.send(result);
        });

        app.get('/footer', async (req, res) => {
            const query = {};
            const cursor = footerCollection.find(query);
            const footer = await cursor.toArray();
            res.send(footer);
        });

        app.get('/footer/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const footer = await footerCollection.findOne(query);
            res.send(footer)
        });

        app.put('/footer/:id', async (req, res) => {
            const id = req.params.id;
            const footerUpdate = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    footerLogo: footerUpdate.footerLogo,
                    footerText: footerUpdate.footerText,
                    footerEmail: footerUpdate.footerEmail,
                    footerAddress: footerUpdate.footerAddress,
                }
            };

            const result = await footerCollection.updateOne(filter, updatedDoc, options);
            res.send(result);

        });

        /****
         * About Us Page
         * *****/

         app.post('/about', async (req, res) => {
            const about = req.body;
            const result = await aboutCollection.insertOne(about);
            res.send(result);
        });

         app.get('/about', async (req, res) => {
            const query = {};
            const cursor = aboutCollection.find(query);
            const about = await cursor.toArray();
            res.send(about);
        });

        app.get('/about/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const about = await aboutCollection.findOne(query);
            res.send(about)
        });

        app.put('/about/:id', async (req, res) => {
            const id = req.params.id;
            const aboutUpdate = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    aboutBannerImg: aboutUpdate.aboutBannerImg,
                    aboutBannerText: aboutUpdate.aboutBannerText,
                    aboutContent: aboutUpdate.aboutContent,
                }
            };

            const result = await aboutCollection.updateOne(filter, updatedDoc, options);
            res.send(result);

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