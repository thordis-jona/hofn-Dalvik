export const gallery = [
  ['hofn-06.jpg', 'Stofa og borðstofa með útsýni yfir Dalvík'],
  ['hofn-23.jpg', 'Borðstofa, nærmynd'],
  ['hofn-03.jpg', 'Borðstofa með teal-veggjum'],
  ['hofn-04.jpg', 'Borðstofa, útsýni um glugga'],
  ['hofn-07.jpg', 'Kamína, nærmynd'],
  ['hofn-27.jpg', 'Kamína með pullum'],
  ['hofn-02.jpg', 'Eldhús með grænni innréttingu'],
  ['hofn-12.jpg', 'Eldhús, breið mynd'],
  ['hofn-20.jpg', 'Eldhús, önnur hlið'],
  ['hofn-21.jpg', 'Eldhúsinnrétting og gas helluborð'],
  ['hofn-11.jpg', 'Eldhús séð frá borðstofu'],
  ['hofn-13.jpg', 'Útsýni úr borðstofu í eldhús'],
  ['hofn-19.jpg', 'Gengið úr holi inn í eldhús'],
  ['hofn-08.jpg', 'Baðherbergi á 1. hæð'],
  ['hofn-18.jpg', 'Flísalögð sturta'],
  ['hofn-29.jpg', 'Sturta, nærmynd'],
  ['hofn-09.jpg', 'Svefnherbergi í kjallara'],
  ['hofn-10.jpg', 'Svefnherbergi í kjallara, önnur hlið'],
  ['hofn-14.jpg', 'Gangur og þvottahúsrými í kjallara'],
  ['hofn-15.jpg', 'Svefnherbergi í risi, bjart'],
  ['hofn-16.jpg', 'Svefnherbergi í risi'],
  ['hofn-17.jpg', 'Svefnherbergi í risi, einbreitt rúm'],
  ['hofn-30.jpg', 'Svefnherbergi í risi með kvistglugga'],
  ['hofn-31.jpg', 'Tvíbreið rúm í risi'],
  ['hofn-22.jpg', 'Falleg smáatriði í innréttingu'],
  ['hofn-26.jpg', 'Eldhúsgangur í grænum lit'],
  ['hofn-25.jpg', 'Borðstofa með upprunalegum viðarbitum'],
  ['hofn-24.jpg', 'Borðstofuborð og stólar'],
] as const;

export const rooms = [
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
] as const;

export const features = [
  ['construction', 'Fagmannlega uppgert', 'Eingöngu sérfræðingar í uppgerð gamalla húsa komu að vinnunni — burðarvirki, þak, klæðning, gluggar, rafmagn, ofnar, lagnir, gólf og dren allt endurnýjað.'],
  ['logs', 'Upprunalegur karakter', 'Gert upp miðað við aldur hússins — nýttir bitar í lofti, upprunalegt gólfefni í stofu og upprunalegi stiginn milli hæða.'],
  ['mountain-snow', 'Paradís útivistarfólks', 'Þrjú skíðasvæði í göngufæri, þyrluskíði á Tröllaskaga og snjósleðaferðir að vetri — frábær staðsetning sumar sem vetur.'],
  ['bed-double', 'Gistileyfi II fyrir 8', 'Húsið er með gistileyfi II fyrir 8 manns sem hefur ekki verið nýtt — tilbúið fyrir útleigu.'],
  ['flame', 'Kamína og notalegheit', 'Kamína milli borðstofu og stofu skapar hlýlegt andrúmsloft fyrir kaldar Dalvíkurnætur.'],
] as const;

export const locationPoints = [
  ['mountain-snow', 'Þrjú skíðasvæði', 'í næsta nágrenni Dalvíkur og Tröllaskaga.'],
  ['cable-car', 'Þyrluskíði', 'á Tröllaskaga — heimsþekkt meðal fjallaskíðafólks.'],
  ['snowflake', 'Snjósleðaparadís', 'á veturna, með greiðum aðgangi að hálendinu.'],
  ['sailboat', 'Eyjafjörður og ströndin', 'í göngufæri, tilvalið fyrir sumarleyfi.'],
] as const;

export const adventures = [
  ['mountain-snow', 'Skíði & fjallaskíði', 'Þrjú skíðasvæði í næsta nágrenni og heimsþekkt fjallaskíðafæri á Tröllaskaga — hlíðarnar taka við beint frá bæjardyrum.'],
  ['footprints', 'Gönguleiðir', 'Fjölbreyttar gönguleiðir liggja upp í fjöllin og með ströndinni, fyrir bæði styttri kvöldgöngur og lengri dagsferðir.'],
  ['waves-horizontal', 'Hvalaskoðun', 'Eyjafjörður er ein besta hvalaskoðunarslóð landsins — stutt er í bátsferðir út á fjörðinn frá Dalvík.'],
] as const;
