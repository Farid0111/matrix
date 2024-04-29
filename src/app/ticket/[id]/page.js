'use client';

import { findTicket, client, databases, Query } from '../../appwrite';
import { useState, useEffect } from 'react';


const TicketsView = ({ params }) => {
  console.log('params is', params);

  const [ticket, setTicket] = useState(null);
  const [ticket_loading, setTicketLoading] = useState(true);
  let unsubscribe;

  async function checkTicket() {
    setTicketLoading(true);
    const theTicket = await findTicket(params.id);
    if (theTicket && theTicket.total && theTicket.total === 1) {
      setTicket(theTicket.documents[0]);
      setTicketLoading(false);
      console.log(theTicket);
    } else {
      window.location.href = '/';
    }
    
  }

  useEffect(() => {
    checkTicket();
  }, []);

  useEffect(() => {
    const unsubscribe = client.subscribe(
      'databases.main_db.collections.tickets.documents',
      (response) => {
        console.log(response.events);
        if (
          response.events.includes(
            'databases.main_db.collections.tickets.documents.*.update'
          )
        ) {
          console.log(response.payload);
          if (response.payload.nonce_value === params.id) {
            console.log(response.payload);
            setTicket(response.payload);
          }
        }
      }
    );
    // return unsubscribe();
  }, [ticket]);

  if (ticket_loading) {
    return (
      <div>
        <p>Chargement ...</p>
      </div>
    );
  }

  if (ticket) {
    return (

      <div style={{ backgroundColor: 'white', minHeight: '100vh',alignItems: 'center',padding:10 }}>
        <div style={{ padding: '0px', textAlign: 'right', fontWeight: 'bold', fontSize: '11px', fontFamily: 'Courier New', width: '300px', background: '#333', color: '#fff', padding: '2.5px 5px', marginBottom: '2.5px' }}>Merci pour votre achat</div>
        <div style={{ padding: '0px', textAlign: 'right', fontWeight: 'bold', fontSize: '11px', fontFamily: 'Courier New', width: '300px', background: '#333', color: '#fff', padding: '2.5px 5px', marginBottom: '2.5px' }}>Faites la capture de votre ticket svp</div>

<br></br>
 
    <div style={{ overflow: 'hidden', position: 'relative', padding: '0px', margin: '2px', border: '1px solid #FFF3E0', width: '190px', height: '125px', float: 'left', WebkitPrintColorAdjust: 'exact' }}>
      <div style={{ position: 'absolute', width: 'auto', top: '25px', right: '75px', color: '#333', fontSize: '10px', padding: '0px' }}><small>1</small></div>
      <div style={{ position: 'absolute', marginTop: '5px', background: '#FF6D00', width: 'auto', color: '#fff', fontWeight: 'bold', fontFamily: 'Agency FB', fontSize: '20px', padding: '2.5px 20px 2.5px 20px', borderRadius: '0 0 20px 0' }}>
        <small style={{ fontSize: '10px', marginLeft: '-17px', position: 'absolute' }}>CFA</small>{ticket.ticket_type.price}
      </div>
      <div style={{ position: 'absolute', top: '40px', right: '0px', display: 'inline', color: '#fff', textAlign: 'right' }}>
        <div style={{ padding: '0px', textAlign: 'right', fontWeight: 'bold', fontSize: '11px', fontFamily: 'Courier New', width: '90px', background: '#333', color: '#fff', padding: '2.5px 5px', marginBottom: '2.5px' }}>TICKET</div>
        <div style={{ padding: '0px 5px 0px 0px', borderTop: '1px solid #fff', borderBottom: '1px solid #fff', textAlign: 'right', fontWeight: 'bold', fontSize: '14px', fontFamily: 'Courier New' }}></div>
     
        <div style={{ padding: '0px 5px 0px 0px', borderTop: '1px solid #fff', borderBottom: '1px solid #fff', textAlign: 'right', fontWeight: 'bold', fontSize: '14px', fontFamily: 'Courier New' }}><small style={{ fontSize: '10px' }}>Us: </small>{ticket.username}</div>
        <div style={{ padding: '0px 5px 0px 0px', borderBottom: '1px solid #fff', textAlign: 'right', fontWeight: 'bold', fontSize: '14px', fontFamily: 'Courier New' }}><small style={{ fontSize: '10px' }}>Ps: </small>{ticket.password}</div>
      </div>
      <div style={{ position: 'absolute', top: '10px', right: '0px', display: 'inline', color: '#fff', textAlign: 'right' }}>
        <div style={{ padding: '0 2.5px', textAlign: 'right', fontSize: '9px', fontWeight: 'bold', color: '#333333' }}></div>
        <div style={{ padding: '0 2.5px', textAlign: 'right', fontSize: '10px', fontWeight: 'bold', color: '#bf0000' }}>Données </div>
        <div style={{ padding: '0 2.5px', textAlign: 'right', fontSize: '10px', fontWeight: 'bold', color: '#000' }}>{ticket.ticket_type.name} </div>
      </div>
      <div style={{ position: 'absolute', bottom: '1px', right: '1px', display: 'inline', color: '#fff', fontSize: '9px', fontWeight: 'bold', margin: '0 -2.5px', padding: '0.0px', width: '50%', textAlign: 'center' }}>62434644</div>
      <div style={{ overflow: 'hidden', padding: '0px', float: 'left' }}>
        <div style={{ marginTop: '-100px', width: '0', height: '0', borderTop: '230px solid transparent', borderLeft: '50px solid transparent', borderRight: '140px solid #FFAB40' }}></div>
      </div>

    </div>

      </div>





    );

																																																																	





	        	     
	        	        	        	        	        	        	        	        	        	        	        	        	        	        	        	        	        	       	        	        	        	        	        	        	        	        	        	        	        	        	        	        	        	        	        	        	        	        	        	        	        	        	        	        	        	        	        	        	        	        	        	        	        	        	        	        	        	        
    
  }
  return (
    <div>
      {' '}
      <div>Vérification en cours...</div>
      <p>
        <br></br>
        NB: Veuillez noter cette adresse ou faire une capture d'écran pour une
        consultation ultérieure.
      </p>
    </div>
  );
};

// export async function generateStaticParams() {
//   const nonces = await getNonces();
//   console.log('nonces are', nonces);
//   return nonces?.documents?.map((nonce) => ({
//     id: '/ticket/' + nonce.value,
//   }));
// }
export default TicketsView;




