import { Fragment } from 'react';
import Head from 'next/head';

import EventSummary from '../../components/event-detail/event-summary';
import EventLogistics from '../../components/event-detail/event-logistics';
import EventContent from '../../components/event-detail/event-content';
import ErrorAlert from '../../components/ui/error-alert';
import Comments from '../../components/input/comments';

import {
  getEventById,
  getFeaturedEvents
} from '../../helpers/api-utils';

function EventDetailPage(props) {
  const event = props.selectedEvent[0];

  if (!event) {
    return <div className="centered">
      <p>Loading...</p>;
    </div>;
  }

  return (
    <Fragment>
      <Head>
        <title>Event - {event.title} </title>
        <meta name="description" content={event.description}/>
      </Head>
      <EventSummary title={event.title}/>
      <EventLogistics date={event.date} address={event.location} image={event.image}
                      imageAlt={event.title}/>
      <EventContent>
        <p>{event.description}</p>
      </EventContent>
      <Comments eventId={props.eventId} />
    </Fragment>
  );
}

export async function getStaticProps(context) {
  const eventId = context.params.eventId;
  const event = await getEventById(eventId);

  return {
    props: {
      selectedEvent: event
    },
    revalidate: 30
  };
}

export async function getStaticPaths() {
  const events = await getFeaturedEvents();

  const paths = events.map(event => ({ params: { eventId: event.id } }));
  return {
    paths: paths,
    fallback: 'blocking' // blocks until page generated
  };
}

export default EventDetailPage;