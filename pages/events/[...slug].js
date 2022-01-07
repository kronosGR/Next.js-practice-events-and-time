import { useRouter } from 'next/router';
import EventList from '../../components/events/event-list';
import ResultsTitle from '../../components/events/results-title';
import { Fragment } from 'react';
import Button from '../../components/ui/button';
import ErrorAlert from '../../components/ui/error-alert';
import { getFilteredEvents } from '../../helpers/api-utils';

function FilteredEventsPage(props) {
  const router = useRouter();

  if (props.harsError) {
    return <Fragment>
      <ErrorAlert>
        <p>Invalid filter items</p>
      </ErrorAlert>
      <div className="center">
        <Button link="/events">Show all events</Button>
      </div>
    </Fragment>;
  }

  const filteredEvents = props.events;

  if (!filteredEvents || filteredEvents.length === 0) {
    return <Fragment>
      <ErrorAlert>
        <p>No events found</p>
      </ErrorAlert>
      <div className="center">
        <Button link="/events">Show all events</Button>
      </div>
    </Fragment>;
  }

  const date = new Date(props.date.year, props.date.month - 1);

  return (
    <Fragment>
      <ResultsTitle date={date}/>
      <EventList items={filtererEvents}/>
    </Fragment>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;

  const filteredData = params.slug;

  const filteredYear = filteredData[0];
  const filteredMonth = filteredData[1];

  const numYear = +filteredYear;
  const numMonth = +filteredMonth;

  if (isNaN(numYear) || isNaN(numMonth) || numYear > 2030 || numYear < 2021) {
    return {
      propss: {
        hasError: true
      }
    };
  }


  const filtererEvents = await getFilteredEvents({
                                                   year: numYear,
                                                   month: numMonth
                                                 });

  return {
    props: {
      events: filtererEvents,
      date: {
        year: numYear,
        month: numMonth
      }
    }
  };
}

export default FilteredEventsPage;