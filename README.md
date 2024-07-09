Intellipdf

Intellipdf is an innovative application designed to read PDFs and interact with users through questions based on the content. Built with Next.js, Intellipdf offers a seamless and intuitive user experience.

Key Features

Zoom Functionality: Easily zoom in and out of PDF documents for better readability.
Pinecone Vectorization: Utilize semantic querying to find relevant information within the PDFs quickly and efficiently.
Authentication via Kinde Auth: Secure and easy authentication for users.
Payment Gateway via Stripe: Integrated Stripe payment gateway for handling transactions.
TRPC Backend: A robust backend built with TypeScript and TRPC.
Installation

Clone the repository:
bash
Copy code
git clone https://github.com/your-username/intellipdf.git
Navigate to the project directory:
bash
Copy code
cd intellipdf
Install the dependencies:
bash
Copy code
npm install
Usage

Start the development server:
bash
Copy code
npm run dev
Open your browser and navigate to http://localhost:3000.
Configuration

Environment Variables
Create a .env.local file in the root of your project and add the following environment variables:

env
Copy code
NEXT_PUBLIC_KIND_AUTH_DOMAIN=your_kinde_auth_domain
NEXT_PUBLIC_KIND_AUTH_CLIENT_ID=your_kinde_auth_client_id
STRIPE_SECRET_KEY=your_stripe_secret_key
PINECONE_API_KEY=your_pinecone_api_key
Replace the placeholder values with your actual credentials.

Contributing

We welcome contributions! Please follow these steps to contribute:

Fork the repository.
Create a new branch (git checkout -b feature/YourFeature).
Commit your changes (git commit -m 'Add some feature').
Push to the branch (git push origin feature/YourFeature).
Open a pull request.
License

This project is licensed under the MIT License - see the LICENSE file for details.

Contact

For any questions or inquiries, please reach out to your-email@example.com.

Feel free to customize the README further based on your specific requirements!
