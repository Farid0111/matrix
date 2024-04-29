'use client';
import Image from 'next/image';

import { useState, useEffect } from 'react';
import { account, ID, getTicketTypes, saveNonce } from './appwrite';
import {
  initFedaPay,
  createCheckout,
  createCheckoutLink,
  generateRandomString,
} from './utils/fedapay';
export default function Home() {
  const [ticket_types, setTicketTypes] = useState(null);
  const [ticket_types_loading, setTicketTypesLoading] = useState(true);
  const [action_loading, setActionLoading] = useState({});

  const website = 'http://localhost:3000';

  const login = async (email, password) => {
    const session = await account.createEmailPasswordSession(email, password);
    setLoggedInUser(await account.get());
  };

  const fetchTicketTypes = async () => {
    setTicketTypesLoading(true);
    const ticketsTypes = await getTicketTypes();
    setTicketTypes(ticketsTypes);
    setTicketTypesLoading(false);
  };

  useEffect(() => {
    fetchTicketTypes();
  }, []);

  // Fonction pour effectuer le paiement
  const handlePaymentAPI = async (amount, ticket_type) => {
    setActionLoading({ loading: ticket_type });
    try {
      const nonce = generateRandomString(8); // Génère une chaîne aléatoire de 8 caractères
      console.log({ nonce });

      // const nonceSaved = await saveNonce({ value: nonce });
      // if (!nonceSaved) {
      //   return;
      // }
      // Créer un paiement via FedaPay
      const checkoutResponse = await createCheckout(
        amount,
        nonce,
        website,
        ticket_type
      );

      if (
        checkoutResponse &&
        checkoutResponse['v1/transaction'] &&
        checkoutResponse['v1/transaction']['id']
      ) {
        const checkoutLink = await createCheckoutLink(
          checkoutResponse['v1/transaction']['id']
        );

        // Rediriger vers la page de paiement FedaPay
        window.location.href = checkoutLink.url;
      }
      setActionLoading({});
    } catch (error) {
      console.error('Error processing payment:', error);
      setActionLoading({});
    }
  };

  // useEffect(() => {
  //   const script = document.createElement('script');
  //   script.src = 'https://cdn.fedapay.com/checkout.js?v=1.1.7';
  //   script.async = true;
  //   document.body.appendChild(script);

  //   return () => {
  //     document.body.removeChild(script);
  //   };
  // }, []);

  // useEffect(() => {
  //   if (typeof window !== 'undefined' && window.FedaPay) {
  //     window.FedaPay.init('.pay-btn', {
  //       public_key: 'pk_sandbox_F6bbn-zHLYMT5I9EUJ2YQXnb',
  //     });
  //   }
  // }, [ticket_types]);

  if (ticket_types_loading) {
    return (
      <div>
        <p>Chargement de la page principale...</p>
      </div>
    );
  }
  if (ticket_types) {
    return (
      <div style={{ backgroundColor: 'orange', minHeight: '100vh',alignItems: 'center',padding:10 }}>
   
        <table className="table-fixed border-separate border border-slate-500 py-5 px-5 gap-8">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Validité</th>
              <th>Prix</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {ticket_types &&
              ticket_types.documents.map((ticket_type, index) => (
                <tr key={index}>
                  <td>{ticket_type.name}</td>
                  <td>{ticket_type.validity}</td>
                  <td>{ticket_type.price}</td>
                  <td>
                    {' '}
                    <button
                      disabled={
                        !ticket_type.tickets || ticket_type.tickets.length === 0
                      }
                      onClick={
                        !ticket_type.tickets || ticket_type.tickets.length === 0
                          ? null
                          : (e) =>
                              handlePaymentAPI(
                                ticket_type.price,
                                ticket_type.$id
                              )
                      }
                      //   data-transaction-amount={ticket_type.price}
                      //   data-transaction-description="Achat de ticket"
                      //   data-customer-email={'toto@tata.com'}
                      //   data-customer-lastname={'Toto Tata'}
                      //   data-environment="sandbox"
                      //   data-public-key="pk_sandbox_F6bbn-zHLYMT5I9EUJ2YQXnb"
                      //   data-transaction-custom_metadata-code={
                      //     ticket_type.tickets.length
                      //   }
                      //   class="pay-btn"
                      //   onComplete={(reason, transaction) => {
                      //     console.log('reason', reason);
                      //   }}
                      className={`group rounded-lg border border-transparent px-2 py-2 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30 ${
                        !ticket_type.tickets || ticket_type.tickets.length === 0
                        ? 'cursor-not-allowed'
                        : 'bg-orange-500 hover:bg-orange-600' // Ajout de la couleur orange pure
                    }`}
                    >
                      {action_loading['loading'] &&
                      action_loading['loading'] === ticket_type.$id
                        ? '...'
                        : 'Acheter'}
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>





    );
  }

  return (
    <div>
      <p>No data</p>
    </div>
  );
  // return (
  //   <main className="flex min-h-screen flex-col items-center justify-between p-24">
  //     <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
  //       <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
  //         Get started by editing&nbsp;
  //         <code className="font-mono font-bold">src/app/page.js</code>
  //       </p>
  //       <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
  //         <a
  //           className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
  //           href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
  //           target="_blank"
  //           rel="noopener noreferrer"
  //         >
  //           By{' '}
  //           <Image
  //             src="/vercel.svg"
  //             alt="Vercel Logo"
  //             className="dark:invert"
  //             width={100}
  //             height={24}
  //             priority
  //           />
  //         </a>
  //       </div>
  //     </div>

  //     <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-full sm:before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
  //       <Image
  //         className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
  //         src="/next.svg"
  //         alt="Next.js Logo"
  //         width={180}
  //         height={37}
  //         priority
  //       />
  //     </div>

  //     <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
  //       <a
  //         href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
  //         className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         <h2 className={`mb-3 text-2xl font-semibold`}>
  //           Docs{' '}
  //           <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
  //             -&gt;
  //           </span>
  //         </h2>
  //         <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
  //           Find in-depth information about Next.js features and API.
  //         </p>
  //       </a>

  //       <a
  //         href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
  //         className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800 hover:dark:bg-opacity-30"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         <h2 className={`mb-3 text-2xl font-semibold`}>
  //           Learn{' '}
  //           <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
  //             -&gt;
  //           </span>
  //         </h2>
  //         <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
  //           Learn about Next.js in an interactive course with&nbsp;quizzes!
  //         </p>
  //       </a>

  //       <a
  //         href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
  //         className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         <h2 className={`mb-3 text-2xl font-semibold`}>
  //           Templates{' '}
  //           <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
  //             -&gt;
  //           </span>
  //         </h2>
  //         <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
  //           Explore starter templates for Next.js.
  //         </p>
  //       </a>

  //       <a
  //         href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
  //         className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         <h2 className={`mb-3 text-2xl font-semibold`}>
  //           Deploy{' '}
  //           <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
  //             -&gt;
  //           </span>
  //         </h2>
  //         <p className={`m-0 max-w-[30ch] text-sm opacity-50 text-balance`}>
  //           Instantly deploy your Next.js site to a shareable URL with Vercel.
  //         </p>
  //       </a>
  //     </div>
  //   </main>
  // );
}
