import type { Locale } from '../i18n/config';

type IconCard = readonly [icon: string, title: string, copy: string];
type LocationPoint = readonly [icon: string, title: string, copy: string];
type GalleryImage = readonly [file: string, alt: string];

interface Room {
  floor: string;
  title: string;
  image: string;
  alt: string;
  details: readonly string[];
}

export interface SiteData {
  gallery: readonly GalleryImage[];
  rooms: readonly Room[];
  features: readonly IconCard[];
  locationPoints: readonly LocationPoint[];
  adventures: readonly IconCard[];
}

export const siteData = {
  is: {
    gallery: [
      ['hofn-06.jpg', 'Stofa og borðstofa með útsýni yfir Dalvík'],
      ['hofn-23.jpg', 'Stofa og sjónvarpsherbergi'],
      ['hofn-03.jpg', 'Borðstofa með kamínu'],
      ['hofn-04.jpg', 'Borðstofa, útsýni um glugga'],
      ['hofn-07.jpg', 'Kamína, nærmynd'],
      ['hofn-27.jpg', 'Eldhús með gaseldavél'],
      ['hofn-02.jpg', 'Eldhús með grænni innréttingu'],
      ['hofn-12.jpg', 'Eldhús séð frá borðstofu'],
      ['hofn-20.jpg', 'Stigi niður'],
      ['hofn-21.jpg', 'Forstofa á fyrstu hæð'],
      ['hofn-11.jpg', 'Svefnherbergi á neðstu hæð'],
      ['hofn-13.jpg', 'Forstofa á neðstu hæð'],
      ['hofn-19.jpg', 'Herbergi í risi'],
      ['hofn-08.jpg', 'Baðherbergi á 1. hæð'],
      ['hofn-18.jpg', 'Herbergi eitt í risi'],
      ['hofn-29.jpg', 'Sturta'],
      ['hofn-09.jpg', 'Svefnherbergi í kjallara'],
      ['hofn-10.jpg', 'Svefnherbergi í kjallara, önnur hlið'],
      ['hofn-14.jpg', 'Herbergi tvö í risi'],
      ['hofn-15.jpg', 'Svefnherbergi í risi, bjart'],
      ['hofn-16.jpg', 'Svefnherbergi í risi'],
      ['hofn-17.jpg', 'Svefnherbergi í risi'],
      ['hofn-30.jpg', 'Svefnherbergi í risi með kvistglugga'],
      ['hofn-31.jpg', 'Tvíbreið rúm í risi'],
      ['hofn-22.jpg', 'Falleg smáatriði'],
      ['hofn-26.jpg', 'Eldhúsgangur í grænum lit'],
      ['hofn-25.jpg', 'Sturta flísalögð'],
      ['hofn-24.jpg', 'Uppgert baðherbergi'],
    ],
    rooms: [
      {
        floor: '1. hæð',
        title: 'Forstofa, baðherbergi & stofa',
        image: 'hofn-08.jpg',
        alt: 'Baðherbergi á 1. hæð',
        details: [
          'Forstofa með flísum á gólfi og fatahengi',
          'Baðherbergi með sturtu, salerni og handlaug í stíl við aldur hússins',
          'Hol með flísum, opið inn í stofu og eldhús',
          'Stofa og borðstofa með upprunalegum viðarborðum og kamínu',
          'Eldhús með viðarinnréttingu, innbyggðum ísskáp og gashelluborði',
        ],
      },
      {
        floor: 'Ris',
        title: 'Hol og þrjú svefnherbergi',
        image: 'hofn-15.jpg',
        alt: 'Svefnherbergi í risi',
        details: [
          'Notalegt hol með fallegum viðarborðum á gólfi',
          'Þrjú svefnherbergi, öll með viðarborðum á gólfi',
          'Kvistgluggar með útsýni yfir Dalvík',
        ],
      },
      {
        floor: 'Kjallari',
        title: 'Svefnherbergi, baðherbergi & þvottahús',
        image: 'hofn-18.jpg',
        alt: 'Sturta í kjallara',
        details: [
          'Innangengt niður auk útgönguhurðar sem snýr til austurs',
          'Baðherbergi með flísum á gólfi og hluta veggja, sturta',
          'Forstofa/þvottahúsrými fyrir þvottavél og þurrkara',
          'Geymsla og svefnherbergi með góðu fataherbergi',
        ],
      },
    ],
    features: [
      ['construction', 'Fagmannlega uppgert', 'Eingöngu sérfræðingar í uppgerð gamalla húsa komu að vinnunni — burðarvirki, þak, klæðning, gluggar, rafmagn, ofnar, lagnir, gólf og dren allt endurnýjað.'],
      ['logs', 'Upprunalegur karakter', 'Gert upp miðað við aldur hússins — nýttir bitar í lofti, upprunalegt gólfefni í stofu og upprunalegi stiginn milli hæða.'],
      ['mountain-snow', 'Paradís útivistarfólks', 'Þrjú skíðasvæði í göngufæri, þyrluskíði á Tröllaskaga og snjósleðaferðir að vetri — frábær staðsetning sumar sem vetur.'],
      ['bed-double', 'Gistileyfi II fyrir 8', 'Húsið er með gistileyfi II fyrir 8 manns sem hefur ekki verið nýtt — tilbúið fyrir útleigu.'],
      ['flame', 'Kamína og notalegheit', 'Kamína milli borðstofu og stofu skapar hlýlegt andrúmsloft fyrir kaldar Dalvíkurnætur.'],
    ],
    locationPoints: [
      ['mountain-snow', 'Þrjú skíðasvæði', 'í næsta nágrenni Dalvíkur og Tröllaskaga.'],
      ['cable-car', 'Þyrluskíði', 'á Tröllaskaga — heimsþekkt meðal fjallaskíðafólks.'],
      ['snowflake', 'Snjósleðaparadís', 'á veturna, með greiðum aðgangi að hálendinu.'],
      ['sailboat', 'Eyjafjörður og ströndin', 'í göngufæri, tilvalið fyrir sumarleyfi.'],
    ],
    adventures: [
      ['mountain-snow', 'Skíði & fjallaskíði', 'Þrjú skíðasvæði í næsta nágrenni og heimsþekkt fjallaskíðafæri á Tröllaskaga — hlíðarnar taka við beint frá bæjardyrum.'],
      ['footprints', 'Gönguleiðir', 'Fjölbreyttar gönguleiðir liggja upp í fjöllin og með ströndinni, fyrir bæði styttri kvöldgöngur og lengri dagsferðir.'],
      ['waves-horizontal', 'Hvalaskoðun', 'Eyjafjörður er ein besta hvalaskoðunarslóð landsins — stutt er í bátsferðir út á fjörðinn frá Dalvík.'],
    ],
  },
  en: {
    gallery: [
      ['hofn-06.jpg', 'Living and dining room overlooking Dalvík'],
      ['hofn-23.jpg', 'Living room and TV room'],
      ['hofn-03.jpg', 'Dining room with a wood-burning stove'],
      ['hofn-04.jpg', 'Dining room and view through the window'],
      ['hofn-07.jpg', 'Close view of the wood-burning stove'],
      ['hofn-27.jpg', 'Kitchen with a gas stove'],
      ['hofn-02.jpg', 'Kitchen with green cabinetry'],
      ['hofn-12.jpg', 'Kitchen viewed from the dining room'],
      ['hofn-20.jpg', 'Staircase downstairs'],
      ['hofn-21.jpg', 'Entrance hall on the first floor'],
      ['hofn-11.jpg', 'Bedroom on the lower floor'],
      ['hofn-13.jpg', 'Entrance hall on the lower floor'],
      ['hofn-19.jpg', 'Attic bedroom'],
      ['hofn-08.jpg', 'Ground-floor bathroom'],
      ['hofn-18.jpg', 'Attic bedroom one'],
      ['hofn-29.jpg', 'Shower'],
      ['hofn-09.jpg', 'Basement bedroom'],
      ['hofn-10.jpg', 'Another view of the basement bedroom'],
      ['hofn-14.jpg', 'Attic bedroom two'],
      ['hofn-15.jpg', 'Bright attic bedroom'],
      ['hofn-16.jpg', 'Attic bedroom'],
      ['hofn-17.jpg', 'Attic bedroom'],
      ['hofn-30.jpg', 'Attic bedroom with a dormer window'],
      ['hofn-31.jpg', 'Double beds in the attic'],
      ['hofn-22.jpg', 'Beautiful details'],
      ['hofn-26.jpg', 'Green-painted kitchen passage'],
      ['hofn-25.jpg', 'Tiled shower'],
      ['hofn-24.jpg', 'Renovated bathroom'],
    ],
    rooms: [
      {
        floor: 'Ground floor',
        title: 'Entrance, bathroom & living room',
        image: 'hofn-08.jpg',
        alt: 'Ground-floor bathroom',
        details: [
          'Tiled entrance hall with coat storage',
          'Bathroom with a shower, toilet and basin in keeping with the age of the house',
          'Tiled central hall opening into the living room and kitchen',
          'Living and dining room with original floorboards and a wood-burning stove',
          'Kitchen with timber cabinetry, an integrated fridge and a gas hob',
        ],
      },
      {
        floor: 'Attic',
        title: 'Landing and three bedrooms',
        image: 'hofn-15.jpg',
        alt: 'Attic bedroom',
        details: [
          'Cosy landing with beautiful timber floorboards',
          'Three bedrooms, all with timber floors',
          'Dormer windows with views across Dalvík',
        ],
      },
      {
        floor: 'Basement',
        title: 'Bedroom, bathroom & laundry',
        image: 'hofn-18.jpg',
        alt: 'Basement shower',
        details: [
          'Internal stairs plus an east-facing exterior door',
          'Bathroom with tiled floor and walls and a shower',
          'Entrance and laundry area with space for a washing machine and dryer',
          'Storage and a bedroom with a generous walk-in wardrobe',
        ],
      },
    ],
    features: [
      ['construction', 'Professionally restored', 'Specialists in historic-house restoration renewed the structure, roof, cladding, windows, electrics, radiators, plumbing, floors and drainage.'],
      ['logs', 'Original character', 'The restoration respects the house’s age, retaining exposed ceiling beams, original living-room floorboards and the original staircase between floors.'],
      ['mountain-snow', 'Made for the outdoors', 'Three nearby ski areas, heli-skiing across Tröllaskagi and winter snowmobile trips make this a remarkable base in every season.'],
      ['bed-double', 'Licensed for eight guests', 'The house holds an Icelandic category II accommodation licence for eight guests and is ready to welcome groups and families.'],
      ['flame', 'Fireside comfort', 'The wood-burning stove between the living and dining rooms creates a warm retreat on cold Dalvík nights.'],
    ],
    locationPoints: [
      ['mountain-snow', 'Three ski areas', 'within easy reach of Dalvík and the Tröllaskagi peninsula.'],
      ['cable-car', 'Heli-skiing', 'across Tröllaskagi, renowned among backcountry skiers worldwide.'],
      ['snowflake', 'Winter snowmobiling', 'with straightforward access into the mountains.'],
      ['sailboat', 'Eyjafjörður and the coast', 'within walking distance and perfect for summer days.'],
    ],
    adventures: [
      ['mountain-snow', 'Skiing & ski touring', 'Three nearby ski areas and world-class ski touring across Tröllaskagi put the mountains almost on the doorstep.'],
      ['footprints', 'Hiking', 'Trails lead into the mountains and along the coast, from short evening walks to full-day adventures.'],
      ['waves-horizontal', 'Whale watching', 'Eyjafjörður is one of Iceland’s finest whale-watching areas, with boat trips departing a short distance from the house.'],
    ],
  },
} as const satisfies Record<Locale, SiteData>;
