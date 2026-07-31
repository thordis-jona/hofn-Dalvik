import type { AvailabilityCalendarMessages } from '../components/AvailabilityCalendar';
import type { InquiryFormMessages } from '../components/InquiryForm';
import type { Locale } from './config';

interface PageMetadata {
  title: string;
  description: string;
  ogImageAlt: string;
}

interface SiteMessages {
  layout: {
    brandLabel: string;
    mainNavigationLabel: string;
    languageNavigationLabel: string;
    footerAddress: string;
  };
  airbnb: {
    label: string;
    ariaLabel: string;
  };
  home: {
    metadata: PageMetadata;
    navigation: readonly { href: string; label: string }[];
    stats: readonly string[];
    inquiryCta: string;
    factsLabel: string;
    facts: readonly { value: string; label: string }[];
    gallery: { kicker: string; title: string; intro: string; viewLabel: string };
    rooms: { kicker: string; title: string; intro: string };
    features: { kicker: string; title: string };
    adventureNote: string;
    availability: { kicker: string; title: string; intro: string; note: string };
    guide: { kicker: string; title: string; intro: string; note: string; cta: string };
    mapTitle: string;
    contactPrefix: string;
    lightbox: { close: string; previous: string; next: string };
  };
  guide: {
    metadata: PageMetadata;
    backLabel: string;
    heroKicker: string;
    heroTitle: string;
    heroIntro: string;
    listKicker: string;
    listTitle: string;
    listIntro: string;
    moreLabel: string;
  };
  error: {
    metadata: Omit<PageMetadata, 'ogImageAlt'>;
    kicker: string;
    title: string;
    intro: string;
    suggestion: string;
    homeLabel: string;
  };
  calendar: AvailabilityCalendarMessages;
  inquiry: InquiryFormMessages;
}

export const ui = {
  is: {
    layout: {
      brandLabel: 'Höfn, Dalvík',
      mainNavigationLabel: 'Aðalvalmynd',
      languageNavigationLabel: 'Tungumál',
      footerAddress: 'Karlsrauðatorg 4, 620 Dalvík · Gistileyfi II',
    },
    airbnb: {
      label: 'Bóka á Airbnb',
      ariaLabel: 'Bóka Höfn á Airbnb (opnast í nýjum flipa)',
    },
    home: {
      metadata: {
        title: 'Höfn í Dalvík · Hús á Tröllaskaga',
        description: 'Höfn er fallega uppgert 135 fm hús í hjarta Dalvíkur fyrir allt að átta gesti, á milli hafs og fjalla á Tröllaskaga.',
        ogImageAlt: 'Stofa og borðstofa í Höfn í Dalvík',
      },
      navigation: [
        { href: '#um-husid', label: 'Um húsið' },
        { href: '#myndir', label: 'Myndir' },
        { href: '#laust', label: 'Lausar dagsetningar' },
        { href: '#ferdahandbok', label: 'Ferðahandbók' },
      ],
      stats: ['135 fm · 3 hæðir', '4 svefnherbergi', '2 baðherbergi', 'Gistir 8 · Gistileyfi II'],
      inquiryCta: 'Senda fyrirspurn',
      factsLabel: 'Helstu upplýsingar',
      facts: [
        { value: '135', label: 'fermetrar' },
        { value: '3', label: 'hæðir' },
        { value: '4', label: 'svefnherbergi' },
        { value: '8', label: 'gestir (gistileyfi II)' },
      ],
      gallery: { kicker: 'Myndasafn', title: 'Andrúmsloftið í húsinu', intro: 'Smelltu á mynd til að skoða stærri útgáfu.', viewLabel: 'Skoða' },
      rooms: { kicker: 'Herbergjaskipan', title: 'Þrjár hæðir, hver með sinn karakter', intro: 'Rúmgott hús sem hentar vel stórum hópum og fjölskyldum.' },
      features: { kicker: 'Sérstaða hússins', title: 'Af hverju Höfn?' },
      adventureNote: 'Veður og aðstæður ráða alltaf för — kynnið ykkur nýjustu upplýsingar áður en lagt er af stað.',
      availability: {
        kicker: 'Lausar dagsetningar',
        title: 'Skipuleggðu dvölina í rólegheitum',
        intro: 'Hér sérðu stöðuna á dagatalinu okkar. Veldu lausan komudag og sendu síðan fyrirspurn — við staðfestum dagsetningar og verð beint við þig.',
        note: 'Dagatalið notar 15 mínútna edge-cache og samstillist reglulega við Airbnb. Smelltu á dagsetningu til að opna Airbnb.',
      },
      guide: {
        kicker: 'Ferðahandbók',
        title: 'Höfn – Dalvík og Tröllaskagi',
        intro: 'Velkomin á Dalvík! Hér höfum við tekið saman nokkra af okkar uppáhaldsstöðum í bænum og nágrenninu — góðan mat, sund, hvalaskoðun, útivist og dagsferðir.',
        note: 'Handbókin er unnin eftir leiðarvísinum sem Thordis skrifaði á Airbnb. Opnunartímar, verð og framboð geta breyst eftir árstíðum; skoðið alltaf vefsíðu viðkomandi staðar áður en lagt er af stað.',
        cta: 'Lesa alla ferðahandbókina — frítt',
      },
      mapTitle: 'Kort af Dalvík',
      contactPrefix: 'Eða hafðu beint samband á',
      lightbox: { close: 'Loka mynd', previous: 'Fyrri mynd', next: 'Næsta mynd' },
    },
    guide: {
      metadata: {
        title: 'Frjáls ferðahandbók um Dalvík · Höfn',
        description: 'Frjáls ferðahandbók frá Höfn um Dalvík, Tröllaskaga og Eyjafjörð — góðan mat, sund, hvalaskoðun, göngur og dagsferðir.',
        ogImageAlt: 'Útsýni yfir Dalvík og fjöll Tröllaskaga',
      },
      backLabel: 'Til baka í Höfn',
      heroKicker: 'Ferðahandbók · frjáls aðgangur',
      heroTitle: 'Dalvík, Tröllaskagi og Eyjafjörður',
      heroIntro: 'Uppáhaldsstaðir okkar fyrir góðan mat, heita potta, hvalaskoðun, göngur og dagsferðir — allt frá Höfn sem bækistöð.',
      listKicker: 'Allir staðirnir',
      listTitle: 'Handbókin er þín — alveg frítt',
      listIntro: 'Opnunartímar, verð og framboð geta breyst eftir árstíðum. Skoðaðu alltaf nýjustu upplýsingar hjá hverjum stað áður en lagt er af stað.',
      moreLabel: 'Skoða nánar',
    },
    error: {
      metadata: { title: 'Síða fannst ekki · Höfn í Dalvík', description: 'Síðan sem þú leitar að fannst ekki. Finndu leiðina aftur í Höfn í Dalvík.' },
      kicker: '404 · Úbbs',
      title: 'Síðan fannst ekki',
      intro: 'Slóðin virðist ekki vera til. Prófaðu að fara aftur á forsíðuna.',
      suggestion: 'Varstu að leita að',
      homeLabel: 'Fara á forsíðu Höfn',
    },
    calendar: {
      eyebrow: 'Lausar dagsetningar',
      title: 'Finndu dagana sem henta',
      instructions: 'Veldu komudag í dagatalinu. Dökkbeige dagar eru uppteknir eða lokaðir og liðnir dagar eru deyfðir.',
      loadingStatus: 'Sæki dagatal…',
      errorStatus: 'Gat ekki sótt dagatal',
      refreshingStatus: 'Samstillir dagatal…',
      calendarLabel: 'Lausar dagsetningar fyrir Höfn',
      previousMonthLabel: 'Fyrri mánuður',
      nextMonthLabel: 'Næsti mánuður',
      legendLabel: 'Skýringar',
      availableLabel: 'Laus',
      unavailableLabel: 'Ekki laus',
      pastLabel: 'Liðinn dagur',
      selectedLabel: 'Valinn dagur',
      selectedDateLabel: 'Komudagur valinn',
    },
    inquiry: {
      validation: {
        name: { required: 'Skrifaðu nafnið þitt.', minLength: 'Nafnið þarf að vera að minnsta kosti 2 stafir.', maxLength: 'Nafnið má vera mest 80 stafir.' },
        email: { required: 'Sláðu inn netfang.', invalid: 'Netfangið virðist ekki vera gilt.', maxLength: 'Netfangið er of langt.' },
        checkin: { invalid: 'Komudagurinn er ekki gild dagsetning.', past: 'Komudagur getur ekki verið liðinn.' },
        checkout: { invalid: 'Brottfarardagurinn er ekki gild dagsetning.' },
        guests: { range: 'Veldu 1–8 gesti.' },
        phone: { maxLength: 'Símanúmerið er of langt.' },
        message: { maxLength: 'Skilaboðin mega vera mest 2000 stafir.' },
        dates: {
          checkinRequired: 'Veldu komudag áður en þú velur brottfarardag.',
          checkoutRequired: 'Veldu brottfarardag.',
          checkoutAfterCheckin: 'Brottfarardagur þarf að vera eftir komudag.',
        },
      },
      fields: {
        name: { label: 'Nafn' },
        email: { label: 'Netfang' },
        checkin: { label: 'Komudagur' },
        checkout: { label: 'Brottfarardagur' },
        guests: { label: 'Fjöldi gesta', placeholder: 't.d. 6' },
        phone: { label: 'Símanúmer', placeholder: 't.d. 555 5555' },
        message: { label: 'Skilaboð', placeholder: 'Segðu okkur aðeins frá ferðinni þinni...' },
      },
      submit: { idle: 'Senda fyrirspurn', submitting: 'Staðfesti upplýsingar…' },
      note: 'Fyrirspurnin opnast sem tölvupóstur til thordis@manifesto.is',
      email: {
        subject: 'Fyrirspurn um bókun - Höfn, Karlsrauðatorg 4',
        labels: { name: 'Nafn', email: 'Netfang', phone: 'Sími', checkin: 'Komudagur', checkout: 'Brottfarardagur', guests: 'Fjöldi gesta', message: 'Skilaboð' },
      },
    },
  },
  en: {
    layout: {
      brandLabel: 'Höfn, Dalvík',
      mainNavigationLabel: 'Main navigation',
      languageNavigationLabel: 'Language',
      footerAddress: 'Karlsrauðatorg 4, 620 Dalvík · Category II accommodation licence',
    },
    airbnb: {
      label: 'Book on Airbnb',
      ariaLabel: 'Book Höfn on Airbnb (opens in a new tab)',
    },
    home: {
      metadata: {
        title: 'Höfn in Dalvík · House on Tröllaskagi',
        description: 'Stay at Höfn, a beautifully restored 135 m² house for up to eight guests in central Dalvík, between the sea and mountains of Tröllaskagi.',
        ogImageAlt: 'Living and dining room at Höfn in Dalvík',
      },
      navigation: [
        { href: '#about', label: 'The house' },
        { href: '#gallery', label: 'Photos' },
        { href: '#availability', label: 'Availability' },
        { href: '#travel-guide', label: 'Travel guide' },
      ],
      stats: ['135 m² · 3 floors', '4 bedrooms', '2 bathrooms', 'Sleeps 8 · Licensed'],
      inquiryCta: 'Send an enquiry',
      factsLabel: 'Key facts',
      facts: [
        { value: '135', label: 'square metres' },
        { value: '3', label: 'floors' },
        { value: '4', label: 'bedrooms' },
        { value: '8', label: 'guests (licensed)' },
      ],
      gallery: { kicker: 'Gallery', title: 'Inside the house', intro: 'Select a photograph to see a larger version.', viewLabel: 'View' },
      rooms: { kicker: 'Room layout', title: 'Three floors, each with its own character', intro: 'A spacious house well suited to families and larger groups.' },
      features: { kicker: 'What makes it special', title: 'Why stay at Höfn?' },
      adventureNote: 'Weather and conditions always come first—check the latest local information before setting out.',
      availability: {
        kicker: 'Available dates',
        title: 'Plan your stay at your own pace',
        intro: 'Check the latest availability, choose an open arrival date and send an enquiry. We will confirm dates and pricing with you directly.',
        note: 'The calendar uses a 15-minute edge cache and synchronises regularly with Airbnb. Select a date to open Airbnb.',
      },
      guide: {
        kicker: 'Travel guide',
        title: 'Höfn – Dalvík and Tröllaskagi',
        intro: 'Welcome to Dalvík. We have gathered some of our favourite places in town and nearby, from good food and swimming to whale watching, outdoor adventures and day trips.',
        note: 'The guide is based on the recommendations Thordis originally wrote for Airbnb. Opening hours, prices and availability can change with the seasons, so always check with each place before setting out.',
        cta: 'Read the complete travel guide — free',
      },
      mapTitle: 'Map of Dalvík',
      contactPrefix: 'Or contact us directly at',
      lightbox: { close: 'Close image', previous: 'Previous image', next: 'Next image' },
    },
    guide: {
      metadata: {
        title: 'Free travel guide to Dalvík · Höfn',
        description: 'A free local guide from Höfn to food, swimming, whale watching, hiking and day trips around Dalvík, Tröllaskagi and Eyjafjörður.',
        ogImageAlt: 'View across Dalvík towards the mountains of Tröllaskagi',
      },
      backLabel: 'Back to Höfn',
      heroKicker: 'Travel guide · free access',
      heroTitle: 'Dalvík, Tröllaskagi and Eyjafjörður',
      heroIntro: 'Our favourite places for good food, hot pools, whale watching, hiking and day trips, all with Höfn as your base.',
      listKicker: 'Every recommendation',
      listTitle: 'The complete guide, entirely free',
      listIntro: 'Opening hours, prices and availability change with the seasons. Always check the latest information directly with each place before setting out.',
      moreLabel: 'Find out more',
    },
    error: {
      metadata: { title: 'Page not found · Höfn in Dalvík', description: 'The page you were looking for could not be found. Return to Höfn in Dalvík.' },
      kicker: '404 · Sorry',
      title: 'Page not found',
      intro: 'That address does not appear to exist. Try returning to the home page.',
      suggestion: 'Were you looking for',
      homeLabel: 'Go to the Höfn home page',
    },
    calendar: {
      eyebrow: 'Available dates',
      title: 'Find dates that work for you',
      instructions: 'Choose an arrival date. Dark beige dates are booked or closed, and past dates are dimmed.',
      loadingStatus: 'Loading calendar…',
      errorStatus: 'Could not load the calendar',
      refreshingStatus: 'Refreshing calendar…',
      calendarLabel: 'Available dates for Höfn',
      previousMonthLabel: 'Previous month',
      nextMonthLabel: 'Next month',
      legendLabel: 'Calendar legend',
      availableLabel: 'Available',
      unavailableLabel: 'Unavailable',
      pastLabel: 'Past date',
      selectedLabel: 'Selected date',
      selectedDateLabel: 'Selected arrival date',
    },
    inquiry: {
      validation: {
        name: { required: 'Enter your name.', minLength: 'Your name must contain at least 2 characters.', maxLength: 'Your name must not exceed 80 characters.' },
        email: { required: 'Enter your email address.', invalid: 'Enter a valid email address.', maxLength: 'The email address is too long.' },
        checkin: { invalid: 'Enter a valid arrival date.', past: 'The arrival date cannot be in the past.' },
        checkout: { invalid: 'Enter a valid departure date.' },
        guests: { range: 'Choose between 1 and 8 guests.' },
        phone: { maxLength: 'The phone number is too long.' },
        message: { maxLength: 'Your message must not exceed 2,000 characters.' },
        dates: {
          checkinRequired: 'Choose an arrival date before selecting a departure date.',
          checkoutRequired: 'Choose a departure date.',
          checkoutAfterCheckin: 'The departure date must be after the arrival date.',
        },
      },
      fields: {
        name: { label: 'Name' },
        email: { label: 'Email' },
        checkin: { label: 'Arrival date' },
        checkout: { label: 'Departure date' },
        guests: { label: 'Number of guests', placeholder: 'e.g. 6' },
        phone: { label: 'Phone number', placeholder: 'e.g. +44 20 1234 5678' },
        message: { label: 'Message', placeholder: 'Tell us a little about your trip…' },
      },
      submit: { idle: 'Send enquiry', submitting: 'Checking details…' },
      note: 'Your enquiry will open as an email to thordis@manifesto.is',
      email: {
        subject: 'Booking enquiry — Höfn, Karlsrauðatorg 4',
        labels: { name: 'Name', email: 'Email', phone: 'Phone', checkin: 'Arrival date', checkout: 'Departure date', guests: 'Number of guests', message: 'Message' },
      },
    },
  },
} as const satisfies Record<Locale, SiteMessages>;
