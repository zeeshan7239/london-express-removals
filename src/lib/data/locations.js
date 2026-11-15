/**
 * Location data for borough-specific SEO landing pages.
 * Each entry generates a page at /locations/[slug]
 * Covers all 33 London boroughs + key areas
 *
 * UPDATED June 2026:
 * All title and description fields now follow the
 * "Removals [Borough] — Man & Van [Postcode] from £[Price]" pattern
 * based on Search Console data showing "removals [borough]"
 * as the highest-impression query pattern.
 */
export const locations = [
  {
    slug: 'camden',
    name: "Camden",
    title: "Removals Camden | Man & Van NW1 from £130",
    description: "Man and van removals in Camden from £130 for the first two hours, then hourly. Flats and houses across NW1, NW3 and NW5. Get your instant quote.",
    hero: {
      eyebrow: "Removals in Camden",
      title: "Removals in Camden — Man & Van in NW1",
      subtitle: "Removals in Camden Town, Kentish Town, Chalk Farm and Belsize Park with a man and van team. Prices from £130 for the first two hours, then hourly, with same-day moves when we have space.",
    },
    about: "Camden stretches from Bloomsbury and King's Cross in the south up to Hampstead in the north, so the postcodes vary a lot: Camden Town and Chalk Farm (NW1), Kentish Town and Gospel Oak (NW5), Belsize Park, Swiss Cottage and Hampstead (NW3), West Hampstead (NW6) and Bloomsbury (WC1). Tell us both addresses when you book, as we use them to work out distance and time.\n\nThe Northern line serves Camden Town, Chalk Farm, Belsize Park, Hampstead and Kentish Town, and the London Overground stops at Camden Road and Gospel Oak. Euston and King's Cross St Pancras are both in the borough, so the streets around them are busy at commuter times. If you can, choose a moving time outside the rush hours.\n\nMuch of the housing is Victorian and Georgian terraces, many converted into flats, alongside mansion blocks and post-war estates. Conversions often have narrow, steep stairs and no lift, so a wardrobe or bed frame may need to come apart. If you need this, turn on Dismantling required and Reassembly required under Furniture services, and add your large items to the Furniture inventory.\n\nFor a studio or one-bedroom flat off Camden High Street, 1 Man with the van may be enough. A family house in Hampstead or Belsize Park usually calls for 2 Men or 3 Men and a longer booking. If you are unsure, pick Not Sure and we will advise.\n\nCamden Council deals with parking suspensions, so ask for one ahead of your date and check its current lead times. Busy streets such as Camden High Street and Kentish Town Road can have loading limits, so tell us when you book if your door is on one. The south of the borough, around Bloomsbury and Holborn, is inside the Congestion Charge zone, so check Transport for London's current rules for your date.",
    areas: [
      "Camden Town",
      "Kentish Town",
      "Chalk Farm",
      "Primrose Hill",
      "Belsize Park",
      "Hampstead",
      "Gospel Oak",
      "West Hampstead",
      "King's Cross",
      "Bloomsbury",
    ],
    faqs: [
      {
        q: "What does a man and van cost in Camden?",
        a: "Prices start from £130, which covers the first two hours with one mover and a van, and extra time is charged by the hour. Moves in Camden often involve stairs in converted houses and parking some way from the door, so mention both in the booking form. A bigger team costs more, and floors, lift access and the distance between your addresses count too. The instant quote shows your price before you book.",
      },
      {
        q: "Which parts of Camden do you cover?",
        a: "We cover Camden, including Camden Town and Chalk Farm (NW1), Kentish Town (NW5), Belsize Park and Hampstead (NW3), West Hampstead (NW6), and Bloomsbury and King's Cross (WC1). If you are unsure whether your address is included, call or message us.",
      },
      {
        q: "Does the Congestion Charge apply to my move in Camden?",
        a: "Parts of south Camden, around Bloomsbury and Holborn, are inside the Congestion Charge zone. Check Transport for London's current rules for your date, and tell us when you book if either address is in that area.",
      },
      {
        q: "Can you take furniture apart for a narrow Camden staircase?",
        a: "Yes, if it needs to come apart. Turn on Dismantling required at pickup and Reassembly required at delivery in the booking form, and add your beds, sofas and other large items to the Furniture inventory so the time is planned properly.",
      },
      {
        q: "How do I park a removal van in Camden?",
        a: "It depends on your street. Where parking is controlled, Camden Council can arrange a suspension, so apply early and check its current lead times. Tell us when you book if the van is likely to park some distance from your door.",
      },
    ],
    postcode: 'NW1',
  },
  {
    slug: 'hackney',
    name: "Hackney",
    title: "Removals Hackney | Man & Van E8 from £130",
    description: "Man and van removals in Hackney from £130 for the first two hours, then hourly. Flats and houses across E8, E9, E5 and N16. Get your instant quote.",
    hero: {
      eyebrow: "Removals in Hackney",
      title: "Removals in Hackney — Man & Van in E8",
      subtitle: "Removals in Hackney, Dalston, Stoke Newington and Clapton with a man and van team. Prices from £130 for the first two hours, then hourly, with same-day moves when we have space.",
    },
    about: "Hackney covers a wide stretch of north-east London, from Haggerston and Hoxton in the south to Stamford Hill and Stoke Newington in the north, and across to Hackney Wick in the east. That means several postcodes: E8 (Hackney Central, Dalston, London Fields), E9 (Homerton, Hackney Wick), E5 (Clapton), N16 (Stoke Newington, Stamford Hill), and E2 and N1 around Haggerston and Hoxton. Enter both addresses in the booking form, as the distance between them affects the time.\n\nThe borough is served mainly by London Overground and National Rail, from stations such as Hackney Central, Dalston Junction, Homerton and Hackney Wick. The Overground's Weaver line also stops at Hackney Downs, Rectory Road, Stoke Newington and Stamford Hill. Hackney Downs and Clapton also have trains to Liverpool Street.\n\nHousing ranges from Victorian and Edwardian terraces to converted warehouses and former factories around Hackney Wick and Haggerston, plus council estates and newer blocks. Warehouse flats can have long corridors, unusual layouts and shared lifts, so tell us about the access in the booking notes, and measure your lift or doorway if you have large items. In older conversions, mention which floor you are on as well.\n\nBusy main roads and bus lanes can limit where a van is able to stop, so tell us when you book if your door is on one. Hackney Council deals with parking suspensions: ask for one ahead of your date and check its current lead times. Many terraces have steps up to the front door, so tell us if your entrance has steps and how far the van will have to park.\n\nA one-bedroom flat in Dalston might need only 1 Man, whereas a terraced house in Stoke Newington or Clapton is likely to need 2 Men or 3 Men for a longer booking. Not sure which? Pick Not Sure in the booking form.",
    areas: [
      "Hackney Central",
      "Dalston",
      "Stoke Newington",
      "Homerton",
      "Clapton",
      "London Fields",
      "Haggerston",
      "Hackney Wick",
      "Hoxton",
      "Stamford Hill",
    ],
    faqs: [
      {
        q: "What does a man and van cost in Hackney?",
        a: "From £130 for the first two hours with one mover and a van, then extra time is charged by the hour. A move from Dalston to Clapton involves less travel than one from Hackney Wick to Stamford Hill, and floors, lift access and team size change the price too. The instant quote shows your price before you book.",
      },
      {
        q: "Which parts of Hackney do you cover?",
        a: "We cover Hackney, including Hackney Central, Dalston and London Fields (E8), Homerton and Hackney Wick (E9), Clapton (E5), and Stoke Newington and Stamford Hill (N16), as well as Haggerston (E2) and Hoxton (N1). If you are unsure whether your address is included, call or message us.",
      },
      {
        q: "Can you move me out of a converted warehouse in Hackney?",
        a: "Yes. Tell us in the booking notes about the lift size, long corridors or tight doorways, and add large items to the Furniture inventory. If something has to come apart, turn on Dismantling required at pickup.",
      },
      {
        q: "Can I get a same-day removal in Hackney?",
        a: "In many cases, yes. Choose today's date in the booking form to see the earliest time left. If online booking for today has closed, pick another date or contact us directly.",
      },
      {
        q: "How do I park a removal van in Hackney?",
        a: "It depends on your street. Where parking is controlled, Hackney Council can arrange a suspension, so apply early and check its current lead times. Tell us when you book if the van is likely to park some distance from your door.",
      },
    ],
    postcode: 'E8',
  },
  {
    slug: 'islington',
    name: "Islington",
    title: "Removals Islington | Man & Van N1 from £130",
    description: "Man and van removals in Islington from £130 for the first two hours, then hourly. Flats and houses across N1, N5, N7 and N19. Get your instant quote.",
    hero: {
      eyebrow: "Removals in Islington",
      title: "Removals in Islington — Man & Van in N1",
      subtitle: "Removals in Angel, Highbury, Canonbury and Barnsbury with a friendly man and van team. Prices from £130 for the first two hours, then hourly, and same-day moves when we have space.",
    },
    about: "Many Islington homes are older houses split into flats, so on most moves the first question is the stairs. Georgian and Victorian terraces around Barnsbury, Canonbury and Highbury often have steep, narrow staircases, tight turns on the landing and no lift, and there are also purpose-built blocks and council estates across the borough. A sofa or wardrobe may have to come apart to get out. If a piece has to, use the Dismantling required and Reassembly required options under Furniture services, and list your large items in the Furniture inventory.\n\nIslington is a compact borough with several postcodes: Angel and Pentonville (N1), Canonbury (N1), Highbury (N5), Holloway (N7), Archway (N19) and Clerkenwell (EC1). Tell us both addresses when you book so the distance and time are right.\n\nThe Northern line serves Angel and Archway, the Victoria line and London Overground serve Highbury & Islington, and Holloway Road and Caledonian Road are on the Piccadilly line. Farringdon, in the south of the borough, has Elizabeth line and Thameslink services. The A1 runs through the borough along Upper Street and Holloway Road, so it can be slow at peak times. Choose your moving time with that in mind. Flats above shops often have a separate street door and steep stairs, so mention the floor in the booking notes.\n\nIslington Council deals with parking suspensions. If your street is in a controlled parking zone, ask the council for one ahead of your date and check its current lead times. If the van has to park away from your door, tell us when you book so we can plan the carrying.\n\nA one-bedroom flat in a converted Barnsbury terrace may need only 1 Man if it is on a low floor, but a top-floor flat or a four-storey townhouse is likely to need 2 Men or 3 Men. Pick Not Sure if you would like our advice.",
    areas: [
      "Angel",
      "Highbury",
      "Canonbury",
      "Barnsbury",
      "Holloway",
      "Archway",
      "Clerkenwell",
      "Pentonville",
    ],
    faqs: [
      {
        q: "What does a man and van cost in Islington?",
        a: "The price starts at £130 for the first two hours with one mover and a van, then extra time is charged hourly. In Islington a top-floor flat in a Georgian or Victorian terrace with no lift takes longer to carry out than a ground-floor flat, so the hours can differ. A bigger team costs more too. The instant quote shows your price before you book.",
      },
      {
        q: "Which parts of Islington do you cover?",
        a: "We cover Islington, including Angel and Pentonville (N1), Canonbury (N1), Highbury (N5), Holloway (N7), Archway (N19) and Clerkenwell (EC1). If you are unsure whether your address is included, call or message us.",
      },
      {
        q: "Can you move me from a top-floor flat or Georgian townhouse in Islington?",
        a: "Yes. Mention the floor and whether there is a lift in the booking notes, and choose the team size that fits (1 Man, 2 Men or 3 Men). Steep stairs mean more carrying, so 2 Men or 3 Men are often a better fit than 1 Man. If you are not sure, pick Not Sure and we will advise.",
      },
      {
        q: "How do I park a removal van in Islington?",
        a: "It depends on your street. Where parking is controlled, Islington Council can arrange a suspension, so apply early and check its current lead times. Tell us when you book if the van is likely to park some distance from your door.",
      },
      {
        q: "Can I get a same-day removal in Islington?",
        a: "In many cases, yes. Choose today's date in the booking form to see the earliest time left. If online booking for today has closed, pick another date or contact us directly.",
      },
    ],
    postcode: 'N1',
  },
  {
    slug: 'wandsworth',
    name: "Wandsworth",
    title: "Removals Wandsworth | Man & Van SW18 from £130",
    description: "Removals in Wandsworth with a man and van from £130 for the first two hours, then hourly. Flats and houses across SW18, SW11 and SW17. Get a quote online.",
    hero: {
      eyebrow: "Removals in Wandsworth",
      title: "Removals in Wandsworth — Man & Van in SW18",
      subtitle: "Reliable removals in Wandsworth, Tooting, Balham and Earlsfield with a friendly man and van team. Prices from £130 for the first two hours, an instant online quote and same-day moves when we have space.",
    },
    about: "Wandsworth is a large borough in South West London, running from the Thames at Battersea and Wandsworth Town down through Earlsfield, Balham and Tooting, and west to Southfields and Putney. The main postcodes are SW18 (Wandsworth and Earlsfield), SW11 (Battersea and Clapham Junction), SW17 (Tooting), SW12 (Balham) and SW15 (Putney). We cover all of them, so wherever your address sits we can plan a route that suits it.\n\nThe housing mix is wide. Streets of Victorian and Edwardian terraces and conversions are common around Earlsfield, Balham and Tooting, so many moves involve upstairs flats, steep stairs and shared hallways. Nearer the river you will find newer apartment blocks, where there are usually lifts but also building rules, such as booking a loading time or the lift with the management team before moving day. There are also post-war estates and houses of all sizes across the borough.\n\nParking and access depend on the street. Many residential roads are controlled parking zones with permit bays, so a removal van often cannot stop near the door without a plan. Wandsworth Council deals with parking suspensions, so contact it ahead of your date, check its current lead times and apply for the space in front of your address. Busy roads around Wandsworth Town, Clapham Junction and Tooting can also slow loading, so it helps to think about travel times when you choose your moving time.\n\nThe area is well connected, which helps if you are moving across London or further afield. Northern line stations serve Balham, Tooting and Battersea Power Station, the District line serves East Putney and Southfields, and Clapham Junction and Wandsworth Town have National Rail services. We handle flat and house moves, studio and student moves, single items and storage runs. You choose 1 Man, 2 Men or 3 Men online and see your price straight away, then pick a date and time that works for you.",
    areas: [
      "Wandsworth Town",
      "Tooting",
      "Balham",
      "Earlsfield",
      "Battersea",
      "Clapham Junction",
      "Southfields",
      "Putney",
    ],
    faqs: [
      {
        q: "How much does a man and van cost in Wandsworth?",
        a: "Pricing is hourly. It starts from £130, which covers the first two hours with one mover and a van, and extra time is charged by the hour. What you pay depends on how many movers you need, how many hours the move takes and the details of both addresses, such as floors, lifts and parking. A short hop from Earlsfield to Tooting involves less travel than a move across the borough. Enter your postcodes in the instant quote to see your price before you book.",
      },
      {
        q: "Do you offer same-day removals in Wandsworth?",
        a: "In many cases, yes, when we have a team free. Select today's date in the booking form to see the earliest time still available. If online booking for today has closed, choose another date or contact us directly.",
      },
      {
        q: "Do I need a parking suspension for a removal in Wandsworth?",
        a: "It is worth arranging if there is no easy parking close to your door. Wandsworth Council handles suspensions, so check its current rules and lead times and apply before your moving date. Let us know when you book if parking is going to be difficult.",
      },
      {
        q: "Can you dismantle and reassemble furniture in Wandsworth?",
        a: "Yes. Turn on Dismantling required and Reassembly required under Furniture services in the booking form, and add your beds, sofas and large items to the Furniture inventory so we can allow enough time. It is especially handy for upstairs flats in terraced conversions.",
      },
      {
        q: "What size team do I need to move a family home in Wandsworth?",
        a: "Tell us how many rooms and large items you are moving and choose 1 Man, 2 Men or 3 Men online. For a larger family home 3 Men is usually the safer choice, and if you are not sure we will help you decide before you confirm.",
      },
    ],
    postcode: 'SW18',
  },
  {
    slug: 'brixton',
    name: "Brixton",
    title: "Removals Brixton | Man & Van SW9 from £130",
    description: "Removals in Brixton with a man and van from £130 for the first two hours, then hourly. Flats and houses across SW9 and SW2. Get an instant quote online.",
    hero: {
      eyebrow: "Removals in Brixton",
      title: "Removals in Brixton — Man & Van in SW9",
      subtitle: "Reliable removals in Brixton, Stockwell, Streatham and Herne Hill with a man and van team. Prices from £130 for the first two hours, an instant online quote and same-day moves when we have space.",
    },
    about: "Brixton sits in the London Borough of Lambeth, mostly across the SW2 and SW9 postcodes, with Streatham (SW16), Herne Hill (SE24) and Tulse Hill close by. Moving in Brixton takes some planning, so a little preparation goes a long way. We cover Brixton and the surrounding area, from a single room to a full family home.\n\nHousing here is mixed. Many streets are lined with Victorian and Edwardian terraces that have been split into flats, which often means narrow hallways, steep staircases and shared entrances. Alongside them you will find purpose-built blocks, council and housing association estates and newer apartment developments, where lifts, entry systems and loading rules vary from building to building. When you book, tell us the floor, whether there is a lift and how far the van is likely to park from the door, because these details affect how long the move takes.\n\nParking is the main thing to plan for. Much of inner Lambeth is covered by controlled parking zones, and the roads around the town centre are busy for much of the day. If the van cannot park close to your door, loading takes longer and so does the hourly cost, so we recommend asking Lambeth Council about a parking suspension in front of your address and checking its current lead times before you choose your moving date. If your street has no space at all, mention it when you book so we can plan the loading with you.\n\nBrixton has Victoria line Tube services and National Rail connections, and the A23 runs through the area, which is useful to know when planning a route south. We handle flat and house moves, studio and student moves, single large items such as sofas and wardrobes, and runs to and from storage. Choose 1 Man, 2 Men or 3 Men online and get a price in about a minute.",
    areas: [
      "Brixton",
      "Stockwell",
      "Streatham",
      "Herne Hill",
      "Tulse Hill",
      "Clapham South",
      "Kennington",
      "Oval",
    ],
    faqs: [
      {
        q: "How much does a man and van cost in Brixton?",
        a: "Prices start from £130, which covers the first two hours with one mover and a van, and extra time is charged by the hour. Two or three movers cost more. The final cost also depends on how long the move takes, floors and lift access, and the distance between the two addresses. A long carry from the van to your door can add time in busy parts of Brixton. Your instant quote shows your price before you book.",
      },
      {
        q: "Do you do same-day removals in Brixton?",
        a: "Often, subject to availability. Choose today's date in the booking form and it will show the earliest time still available. If there is nothing left today, pick another date or contact us directly.",
      },
      {
        q: "Do I need a parking suspension for a removal in Brixton?",
        a: "It is worth arranging if parking near your door is limited, which it often is in controlled parking zones. Lambeth Council handles suspensions, so check its current rules and lead times and apply before your moving date. If you cannot get one, tell us when you book so we can plan around it.",
      },
      {
        q: "Can you take apart and reassemble furniture in Brixton flats?",
        a: "Yes. In the booking form, turn on Dismantling required and Reassembly required under Furniture services. This helps in converted flats where tight stairwells make bulky furniture hard to carry whole. Add your beds, sofas and large items to the Furniture inventory so we can allow enough time.",
      },
      {
        q: "What size team do I need for a flat move in Brixton?",
        a: "You choose the team size when you book: 1 Man, 2 Men or 3 Men with the van. A studio or one-bedroom flat with few large items is often suited to 1 Man or 2 Men, while a bigger flat or house may need 3 Men. If you are not sure, choose Not Sure in the booking form and we will advise.",
      },
    ],
    postcode: 'SW9',
  },
  {
    slug: 'clapham',
    name: "Clapham",
    title: "Removals Clapham | Man & Van SW4 from £130",
    description: "Man and van removals in Clapham from £130 for the first two hours, then hourly. Flats and houses across SW4, SW11 and SW12. Get your instant quote.",
    hero: {
      eyebrow: "Removals in Clapham",
      title: "Removals in Clapham — Man & Van in SW4",
      subtitle: "Removals in Clapham Common, Clapham North, Clapham Old Town and Clapham Junction with a man and van team. Prices from £130 for the first two hours, then hourly, with same-day moves when we have space.",
    },
    about: "Clapham sits on the border of two boroughs. Lambeth covers areas such as Clapham North and Old Town, while Wandsworth covers Clapham Junction and the Battersea side, so the council that deals with your parking depends on your street. Postcodes include SW4 (Clapham Common, Clapham North, Old Town), SW11 (Clapham Junction) and SW12 (Balham and Clapham South). Enter both addresses when you book so the distance and time can be worked out.\n\nThe Northern line serves Clapham North, Clapham Common and Clapham South. Clapham High Street is on the London Overground, and Clapham Junction has National Rail and Overground services. Balham, one stop south of Clapham South on the Northern line, is a short move away. Roads around the Common and the high street are busy at peak times and at weekends, so choose your moving time with that in mind.\n\nMany homes here are Victorian terraces and period conversions, with mansion blocks and larger Victorian houses near the Common, and some older houses in Old Town. Period conversions often mean steep stairs and no lift. If a bed or wardrobe needs to come apart, turn on Dismantling required and Reassembly required under Furniture services, and add it to the Furniture inventory.\n\nBecause Clapham is split between two councils, check whether Lambeth Council or Wandsworth Council runs your street before you ask for a parking suspension, and check its current lead times. Parking near the Common can be tight, so tell us when you book if the van may have to park some way from your door.\n\nA one-bedroom flat near Clapham North might suit 1 Man, while a family house in Clapham Park or Balham is likely to need 2 Men or 3 Men for a longer booking. Select Not Sure in the booking form if you would like advice.",
    areas: [
      "Clapham Common",
      "Clapham North",
      "Clapham South",
      "Clapham Old Town",
      "Clapham Junction",
      "Abbeville Village",
      "Clapham Park",
      "Balham",
    ],
    faqs: [
      {
        q: "What does a man and van cost in Clapham?",
        a: "Prices start from £130 for the first two hours with one mover and a van, with extra time charged by the hour. Parking near Clapham Common can be tight, and a long carry from the van adds time, so tell us about it when you book. Team size, floors, lift access and the distance between your addresses also change the price. The instant quote shows it before you book.",
      },
      {
        q: "Which parts of Clapham do you cover?",
        a: "We cover Clapham, including Clapham Common, Clapham North, Clapham South and Old Town (SW4), Clapham Junction (SW11) and nearby Balham (SW12). If you are unsure whether your address is included, call or message us.",
      },
      {
        q: "Which council do I ask for a parking suspension in Clapham?",
        a: "Clapham is split between Lambeth and Wandsworth, so it depends on your street. Check which council manages parking on it, apply early, and check its current lead times. Tell us when you book if the van is likely to park some distance from your door.",
      },
      {
        q: "Can you move me out of a period conversion near Clapham Common?",
        a: "Yes. Mention the floor and whether there is a lift in the booking notes, and add large items to the Furniture inventory. If something has to come apart, turn on Dismantling required at pickup and Reassembly required at delivery.",
      },
      {
        q: "Can I get a same-day removal in Clapham?",
        a: "In many cases, yes. Choose today's date in the booking form to see the earliest time left. If online booking for today has closed, pick another date or contact us directly.",
      },
    ],
    postcode: 'SW4',
  },
  {
    slug: 'greenwich',
    name: "Greenwich",
    title: "Removals Greenwich | Man & Van SE10 from £130",
    description: "Removals in Greenwich with a man and van from £130 for the first two hours, then hourly. Flats and houses in SE10, SE3 and SE18. Book an instant quote.",
    hero: {
      eyebrow: "Removals in Greenwich",
      title: "Removals in Greenwich — Man & Van in SE10",
      subtitle: "Removals in Greenwich, Blackheath, Charlton and Woolwich, from period terraces to riverside apartments. Prices from £130 for the first two hours, then hourly, with an instant online quote.",
    },
    about: "The Royal Borough of Greenwich runs along the south bank of the Thames from Deptford Creek to Thamesmead, so moves here cover a lot of ground. You might be leaving a Georgian or Victorian terrace near Greenwich Park, a riverside apartment on the Greenwich Peninsula, or a new home around Woolwich.\n\nThe main postcodes are SE10 (Greenwich), SE3 (Blackheath and Kidbrooke), SE7 (Charlton), SE18 (Woolwich and Plumstead), SE9 (Eltham) and SE28 (Thamesmead). Tell us both addresses when you book and we will work out the time and distance for you.\n\nThe historic streets around the town centre and Greenwich Park include some narrow and sloping roads, and visitors make them busy at weekends. If you can, choose a weekday or an early start, and check the parking signs on your street before moving day.\n\nIn newer riverside blocks, the building manager often needs notice to book a lift or loading bay, and some blocks limit moving hours. Ask your landlord or managing agent about the rules before you book, and tell us the floor and lift details so we can allow the right time.\n\nThe Royal Borough of Greenwich handles parking suspensions. If your street is a controlled parking zone, request one early and check its current lead times.\n\nGetting around is easier than the geography suggests. The DLR serves Cutty Sark and Greenwich, the Jubilee line serves North Greenwich, the Elizabeth line serves Woolwich, and Southeastern trains run across the borough. The A102 Blackwall Tunnel approach can be busy, so it helps to plan your route with timing in mind.\n\nMoves in the south of the borough tend to look different from those by the river. Eltham, for example, has many family houses alongside its flats, so a move there can involve a bigger load, more rooms and sometimes a larger team, while a riverside flat may be a smaller move with a lift to coordinate. Tell us which is closer to yours and choose the team size online.",
    areas: [
      "Greenwich Town",
      "Blackheath",
      "Charlton",
      "Woolwich",
      "Eltham",
      "Kidbrooke",
      "Plumstead",
      "Thamesmead",
    ],
    faqs: [
      {
        q: "How is a removal priced in Greenwich?",
        a: "Pricing is hourly, starting at £130 for the first two hours with one mover and a van, then extra time is charged by the hour. Greenwich runs from the riverside to Eltham and Thamesmead, so the distance between your addresses matters, along with team size, floors and lift access. You can see the price in the instant quote before booking.",
      },
      {
        q: "Can you move me to or from a riverside apartment in Greenwich?",
        a: "Yes. Check with your building manager whether you need to book a lift or loading bay and what hours moves are allowed, then tell us the floor and access details when you book so we can plan the timing.",
      },
      {
        q: "Are there parking restrictions around Greenwich town centre?",
        a: "Parking is controlled on many streets, particularly near the centre and the park. The Royal Borough of Greenwich handles parking suspensions, so check its current rules and lead times, and tell us if the van will be some way from your door.",
      },
      {
        q: "Do you cover Woolwich, Eltham and Thamesmead?",
        a: "Yes. We cover Greenwich, including Woolwich and Plumstead (SE18), Eltham (SE9) and Thamesmead (SE28). If you are unsure whether your address is included, call or message us.",
      },
      {
        q: "Can I book a removal in Greenwich for today?",
        a: "Sometimes, when we have a team free. Select today's date in the booking form to see the earliest time still available. If online booking for today is closed, choose another date or call us.",
      },
    ],
    postcode: 'SE10',
  },
  {
    slug: 'croydon',
    name: "Croydon",
    title: "Removals Croydon | Man & Van CR0 from £130",
    description: "Man and van removals in Croydon from £130 for the first two hours, then hourly. Flats and houses across CR0, CR2, CR7 and CR8. Get an instant quote.",
    hero: {
      eyebrow: "Removals in Croydon",
      title: "Removals in Croydon — Man & Van in CR0",
      subtitle: "Removals in Croydon, South Croydon, Purley and Thornton Heath with a man and van team. Prices from £130 for the first two hours, then hourly, with same-day moves when we have space.",
    },
    about: "Croydon is one of London's largest boroughs, so the postcodes vary: Croydon town centre and Addiscombe (CR0), Thornton Heath (CR7), Selhurst (SE25), Norbury (SW16), South Croydon and Selsdon (CR2), Purley (CR8) and Coulsdon (CR5). Tell us both addresses when you book, as we use them to work out distance and time.\n\nEast Croydon and West Croydon stations, Tramlink and the main roads through the centre are busy at commuter times. Where you can, choose a moving time outside the rush hours, particularly for a pick-up in the town centre.\n\nThe housing is a real mix. The centre has many flats in tower blocks and new developments, where loading bays and lift bookings matter. Addiscombe and Thornton Heath have Victorian and Edwardian terraces, and further south, Purley and Coulsdon have more 1930s semis and detached family homes, usually with driveways and easier parking. The North Downs rise to the south of the centre, so many roads in Sanderstead, Selsdon and Purley are on hills. Tell us about a steep drive or a long carry from the van.\n\nFor a studio or one-bedroom flat in the centre, 1 Man with the van may be enough. A three-bedroom family house in South Croydon or Purley usually calls for 2 Men or 3 Men and a longer booking. If you are unsure, pick Not Sure and we will advise.\n\nCroydon Council deals with parking suspensions, so ask for one ahead of your date and check its current lead times. If you live in a block, ask your building manager about lift booking and loading bay rules, and tell us when you book if there are time limits.",
    areas: [
      "Croydon Town Centre",
      "South Croydon",
      "Purley",
      "Thornton Heath",
      "Norbury",
      "Selhurst",
      "Addiscombe",
      "Coulsdon",
    ],
    faqs: [
      {
        q: "What does a man and van cost in Croydon?",
        a: "Prices start from £130, which covers the first two hours with one mover and a van, and extra time is charged by the hour. Moves from town centre flats can involve lifts and loading bays, so mention these in the booking form. A bigger team costs more, and floors, lift access and the distance between your addresses count too. Add your floors and lift details and the instant quote will show the price before you commit.",
      },
      {
        q: "Which parts of Croydon do you cover?",
        a: "We cover Croydon, including the town centre and Addiscombe (CR0), Thornton Heath (CR7), Selhurst (SE25), Norbury (SW16), South Croydon and Selsdon (CR2), Purley (CR8) and Coulsdon (CR5). Not sure which postcode area your address falls in? Call or message us and we will confirm.",
      },
      {
        q: "Can you move me out of a Croydon town centre flat?",
        a: "Yes. Many town centre blocks have a lift and a loading bay, and some require a booking. Check with your building manager, and tell us in the booking form how many floors there are and whether a lift is available.",
      },
      {
        q: "Can you take furniture apart for a narrow staircase?",
        a: "Yes, if it needs to come apart. Turn on Dismantling required at pickup and Reassembly required at delivery in the booking form, and add your beds, sofas and other large items to the Furniture inventory so the time is planned properly.",
      },
      {
        q: "How do I park a removal van in Croydon?",
        a: "It depends on your street. Where parking is controlled, Croydon Council can arrange a suspension, so apply early and check its current lead times. Tell us when you book if the van is likely to park some distance from your door.",
      },
    ],
    postcode: 'CR0',
  },
  {
    slug: 'stratford',
    name: "Stratford",
    title: "Removals Stratford | Man & Van E15 from £130",
    description: "Man and van removals in Stratford from £130 for the first two hours, then hourly. Flats and houses across E15, E7, E13 and E20. Get your instant quote.",
    hero: {
      eyebrow: "Removals in Stratford",
      title: "Removals in Stratford — Man & Van in E15",
      subtitle: "Removals in Stratford, West Ham, Forest Gate and East Ham with a man and van team. Prices from £130 for the first two hours, then hourly, with same-day moves when we have space.",
    },
    about: "Stratford is in the London Borough of Newham, and a lot of the housing here is recent: apartment blocks around the town centre, the International Quarter and East Village (E20), alongside Victorian and Edwardian terraces in Forest Gate (E7), West Ham and Plaistow (E13) and East Ham (E6). Give us both addresses when you book, because the distance between them affects how long the move takes.\n\nMany newer blocks have lifts, concierge desks and rules about when you can move in, such as booked lift slots or loading bays. Ask your building manager or landlord about these before your date, and tell us in the booking notes about the lift, the floor and how far the van will be from your door. If you have a large sofa or wardrobe, check the lift size first.\n\nStratford station has the Central and Jubilee lines, the DLR, the Elizabeth line and London Overground services, and West Ham has the District, Hammersmith & City and Jubilee lines and the DLR. Stratford International has DLR and Southeastern high-speed services. Plaistow, Upton Park and East Ham are on the District and Hammersmith & City lines. The streets around Stratford town centre and Westfield Stratford City can be busy, especially at weekends, so allow extra time.\n\nNewham Council deals with parking suspensions. Where parking is controlled, ask for one ahead of your date and check its current lead times. If the van will have to park away from your door, or your block has a loading bay we should know about, tell us when you book.\n\nA one-bedroom flat in a new block by Stratford station might suit 1 Man, while a family house in Forest Gate or Plaistow is likely to need 2 Men or 3 Men for a longer booking. Not Sure is there in the booking form if you want our advice.",
    areas: [
      "Stratford",
      "East Village",
      "West Ham",
      "Forest Gate",
      "Maryland",
      "Plaistow",
      "Upton Park",
      "East Ham",
    ],
    faqs: [
      {
        q: "What does a man and van cost in Stratford?",
        a: "The price starts from £130 for the first two hours with one mover and a van, and extra time is charged by the hour. In Stratford's newer blocks, a booked lift slot or a long carry from the loading bay can affect the time, so mention both in the booking notes. Team size and the distance between your addresses matter too. The instant quote shows your price before you book.",
      },
      {
        q: "Which parts of Stratford and Newham do you cover?",
        a: "We cover Stratford and the surrounding parts of Newham, including Stratford and Maryland (E15), East Village (E20), Forest Gate (E7), Plaistow and Upton Park (E13) and East Ham (E6). If you are unsure whether your address is included, call or message us.",
      },
      {
        q: "Can you move me out of a new-build flat in Stratford?",
        a: "Yes. Check your building's rules for lift bookings and loading bays before your date, and mention the floor, the lift and the carrying distance in the booking notes. Add large items to the Furniture inventory so the time is planned properly.",
      },
      {
        q: "Can I get a same-day removal in Stratford?",
        a: "In many cases, yes. Choose today's date in the booking form to see the earliest time left. If online booking for today has closed, pick another date or contact us directly.",
      },
      {
        q: "How do I park a removal van in Stratford?",
        a: "It depends on your street or building. Where parking is controlled, Newham Council can arrange a suspension, so apply early and check its current lead times. Tell us when you book if the van is likely to park some distance from your door.",
      },
    ],
    postcode: 'E15',
  },
  {
    slug: 'shoreditch',
    name: "Shoreditch",
    title: "Removals Shoreditch | Man & Van E1 from £130",
    description: "Man and van removals in Shoreditch from £130 for the first two hours, then hourly. Flats and lofts across E1, E2, EC2A and N1. Get an instant quote.",
    hero: {
      eyebrow: "Removals in Shoreditch",
      title: "Removals in Shoreditch — Man & Van in E1",
      subtitle: "Removals in Shoreditch, Hoxton, Bethnal Green and Spitalfields with a man and van team. Prices from £130 for the first two hours, then hourly, with same-day moves when we have space.",
    },
    about: "Shoreditch sits on the border of Hackney, Tower Hamlets and the City, so the postcodes vary from street to street: Shoreditch and Spitalfields (E1), Bethnal Green (E2), Shoreditch High Street (EC2A), Hoxton (N1, E2) and Old Street (EC1V). Tell us both addresses when you book, as we use them to work out distance and time.\n\nShoreditch High Street, Hoxton and Bethnal Green are on the Overground, and Old Street, Bethnal Green and Liverpool Street are close by. The streets are busy all day, and Columbia Road Flower Market and the Brick Lane markets on Sundays bring crowds and slow traffic. A weekday or an early start often makes loading easier.\n\nThe housing is a mix of converted warehouses and lofts, Victorian terraces in Hoxton and Bethnal Green, former council estates and new-build apartment towers. Conversions can have narrow stairs, goods lifts or no lift at all, and newer blocks often have a concierge and set hours for moves. A wardrobe or bed frame may need to come apart.\n\nFor a studio or one-bedroom flat, 1 Man with the van may be enough. A larger flat or a shared house usually calls for 2 Men or 3 Men and a longer booking. If you are unsure, pick Not Sure and we will advise.\n\nParking suspensions are handled by the council for your street: Hackney Council, Tower Hamlets Council or, near Old Street (EC1V), Islington Council. Ask for one ahead of your date and check their current lead times. The edge of the City, around Liverpool Street and Old Street, is in or close to the Congestion Charge zone, so check Transport for London's current rules for your date.",
    areas: [
      "Shoreditch",
      "Hoxton",
      "Bethnal Green",
      "Spitalfields",
      "Old Street",
      "Brick Lane",
      "Haggerston",
      "Whitechapel",
    ],
    faqs: [
      {
        q: "What does a man and van cost in Shoreditch?",
        a: "Prices start from £130, which covers the first two hours with one mover and a van, and extra time is charged by the hour. Moves from lofts and converted warehouses can involve goods lifts and loading limits, so mention these in the booking form. A bigger team costs more, and floors, lift access and the distance between your addresses count too. Add your pick-up and delivery details to the quote form and you will see the price before you go any further.",
      },
      {
        q: "Which parts of Shoreditch do you cover?",
        a: "We cover Shoreditch and the streets around it, including Shoreditch and Spitalfields (E1), Bethnal Green (E2), Shoreditch High Street (EC2A), Hoxton (N1, E2) and Old Street (EC1V). If your address is on the border with the City or Tower Hamlets, call or message us and we will check.",
      },
      {
        q: "Does the Congestion Charge apply to my move in Shoreditch?",
        a: "The edge of the City, around Liverpool Street and Old Street, is in or close to the Congestion Charge zone. Check Transport for London's current rules for your date, and tell us when you book if either address is near the zone.",
      },
      {
        q: "Can you move me from a loft or warehouse conversion?",
        a: "Yes. Many have a goods lift, a shared entrance or set hours for moves. Check with your building manager, and tell us the floor and lift details in the booking form so the time is planned properly.",
      },
      {
        q: "How do I park a removal van in Shoreditch?",
        a: "It depends on your street. Where parking is controlled, the council for your street can arrange a suspension: Hackney Council, Tower Hamlets Council or, near Old Street (EC1V), Islington Council. Apply early and check their current lead times. Tell us when you book if the van is likely to park some distance from your door.",
      },
    ],
    postcode: 'E1',
  },
  {
    slug: 'romford',
    name: "Romford",
    title: "Removals Romford | Man & Van RM1 from £130",
    description: "Man and van removals in Romford from £130 for the first two hours, then hourly. Flats and houses across RM1, RM2, RM5, RM11, RM14. Instant quote.",
    hero: {
      eyebrow: "Removals in Romford",
      title: "Removals in Romford — Man & Van in RM1",
      subtitle: "Removals in Romford, Hornchurch, Upminster and Gidea Park with a man and van team. Prices from £130 for the first two hours, then hourly, with same-day moves when we have space.",
    },
    about: "Romford is in the London Borough of Havering, on the eastern edge of London. Postcodes include Romford (RM1, RM7), Gidea Park (RM2), Harold Hill (RM3), Collier Row (RM5), Hornchurch (RM11, RM12), Rainham (RM13) and Upminster (RM14). Tell us both addresses when you book, as we use them to work out distance and time.\n\nRomford and Gidea Park are on the Elizabeth line, and the District line serves Upminster, Hornchurch and Elm Park. The A12 and the A127 run close by, and the M25 is not far. The roads around the town centre are busy at commuter times and on market days, so a moving time outside the rush hours often helps.\n\nThe housing is mainly 1930s semis and terraces, with newer flats in the town centre. Gidea Park is known for its early 20th century Arts and Crafts houses, and Upminster and Hornchurch have larger family homes, many with driveways. Town centre flats often have a lift and loading rules.\n\nFor a studio or one-bedroom flat, 1 Man with the van may be enough. A three-bedroom family house usually calls for 2 Men or 3 Men and a longer booking. If you are unsure, pick Not Sure and we will advise.\n\nHavering Council deals with parking suspensions, so ask for one ahead of your date and check its current lead times. Outside the centre, parking is often easier, but tell us when you book if the van is likely to park some distance from your door.",
    areas: [
      "Romford",
      "Gidea Park",
      "Collier Row",
      "Harold Hill",
      "Hornchurch",
      "Upminster",
      "Rainham",
      "Elm Park",
    ],
    faqs: [
      {
        q: "What does a man and van cost in Romford?",
        a: "Prices start from £130, which covers the first two hours with one mover and a van, and extra time is charged by the hour. Moves from town centre flats can involve lifts and loading rules, so mention these in the booking form. A bigger team costs more, and floors, lift access and the distance between your addresses count too. The quick online quote gives you a price for your own move before you commit.",
      },
      {
        q: "Which parts of Romford do you cover?",
        a: "We cover Romford and the London Borough of Havering, including Romford (RM1, RM7), Gidea Park (RM2), Harold Hill (RM3), Collier Row (RM5), Hornchurch (RM11, RM12), Rainham (RM13) and Upminster (RM14). If you are not sure whether your address is in our area, a quick call or message is enough.",
      },
      {
        q: "Can you move me out of a Romford town centre flat?",
        a: "Yes. Many town centre blocks have a lift and a loading area, and some require a booking. Check with your building manager, and tell us in the booking form how many floors there are and whether a lift is available.",
      },
      {
        q: "Can you take furniture apart for a narrow staircase?",
        a: "Yes, if it needs to come apart. Turn on Dismantling required at pickup and Reassembly required at delivery in the booking form, and add your beds, sofas and other large items to the Furniture inventory so the time is planned properly.",
      },
      {
        q: "How do I park a removal van in Romford?",
        a: "It depends on your street. Where parking is controlled, Havering Council can arrange a suspension, so apply early and check its current lead times. Tell us when you book if the van is likely to park some distance from your door.",
      },
    ],
    postcode: 'RM1',
  },
  {
    slug: 'barking',
    name: "Barking",
    title: "Removals Barking | Man & Van IG11 from £130",
    description: "Man and van removals in Barking from £130 for the first two hours, then hourly. Houses and flats across IG11 and Dagenham. Get an instant quote online.",
    hero: {
      eyebrow: "Removals in Barking",
      title: "Removals in Barking — Man & Van in IG11",
      subtitle: "Removals in Barking, Dagenham and Chadwell Heath, from estate houses to new-build flats. Prices from £130 for the first two hours, with an instant online quote.",
    },
    about: "Barking and Dagenham has a mix of town-centre flats, 1920s and 1930s estate houses and new riverside homes. Around Barking station there is a busy town centre. Further east the Becontree Estate is one of the largest housing estates ever built in England, and down by the Thames the Barking Riverside development keeps adding new homes. A move in this borough can be a family house you load from the front door or a modern flat with a lift and a booked loading bay.\n\nWe cover IG11 for Barking, RM8, RM9 and RM10 for Dagenham and the Becontree Estate, and RM6 around Chadwell Heath. If you are not sure whether your address is included, call or message us and we will confirm. We also cover nearby Ilford and Goodmayes.\n\nBefore moving day, think about access. On estate streets the van can often park close to the front door, but a block of flats may have a lift that needs booking, a shared entrance, or a loading area you reserve with the building manager. Tell us which applies when you book, along with the floor you are on, and we will allow the right time for loading.\n\nParking rules vary from street to street. Barking and Dagenham Council handles parking suspensions, so if you need a space reserved outside your address, contact the council early and check its current lead times. Some roads close to Barking station and the town centre can be congested at busy times, so an early start can help.\n\nBarking is well connected. The District and Hammersmith & City lines, c2c trains and the Overground to Barking Riverside all serve Barking station, and the A13 and the North Circular (A406) are close by for longer routes across London or towards Essex. We help with flat and house moves, student and single-item moves and storage runs. Pick 1 Man, 2 Men or 3 Men, then choose a date and time online.",
    areas: [
      "Barking",
      "Dagenham",
      "Becontree",
      "Becontree Heath",
      "Chadwell Heath",
      "Barking Riverside",
      "Marks Gate",
      "Thames View",
    ],
    faqs: [
      {
        q: "How much does a man and van cost in Barking?",
        a: "Pricing starts from £130, which covers the first two hours with one mover and a van, and extra time is charged by the hour. A bigger team costs more, and a house on the Becontree Estate can be quicker to load than a flat that is up several floors, so the hours differ between the two. Your instant quote shows your price before you book.",
      },
      {
        q: "Can you move a house on the Becontree Estate?",
        a: "Yes, we cover Dagenham and the Becontree Estate. Many homes there are houses rather than flats, so tell us the number of bedrooms and any large items, such as a large wardrobe or sofa, in the booking form, and choose a team size to match.",
      },
      {
        q: "Do you do same-day removals in Barking?",
        a: "Often, when we have a team free. Pick today's date in the booking form and it shows the earliest time still available. If today is full, choose another date or contact us directly.",
      },
      {
        q: "Do I need a parking suspension for a removal in Barking?",
        a: "It helps if there is no easy parking close to your door. Barking and Dagenham Council handles suspensions, so check its current rules and lead times and apply before your moving date. Let us know when you book if parking will be tight.",
      },
      {
        q: "Can you take apart beds and wardrobes before the move?",
        a: "Yes. Turn on Dismantling required and Reassembly required under Furniture services in the booking form, and add your beds, sofas and large items to the Furniture inventory so we can allow enough time on the day.",
      },
    ],
    postcode: 'IG11',
  },
  {
    slug: 'barnet',
    name: "Barnet",
    title: "Removals Barnet | Man & Van EN5 from £130",
    description: "Man and van removals in Barnet from £130 for the first two hours, then hourly. Flats and houses across EN5, N3, N12, NW4 and NW7. Get an instant quote.",
    hero: {
      eyebrow: "Removals in Barnet",
      title: "Removals in Barnet — Man & Van in EN5",
      subtitle: "Removals in Barnet, Finchley, Hendon and Mill Hill with a man and van team. Prices from £130 for the first two hours, then hourly, with same-day moves when we have space.",
    },
    about: "Barnet is a large borough in North London. Postcodes include Chipping Barnet and High Barnet (EN5), East Barnet (EN4), Whetstone (N20), Finchley (N3, N12), Hendon (NW4), Mill Hill (NW7) and Golders Green (NW11). Tell us both addresses when you book, as we use them to work out distance and time.\n\nThe Northern line serves High Barnet, Finchley Central, Hendon Central, Colindale, Mill Hill East and Golders Green. The A1, the A406 North Circular and the M1 are close, and they are busy at commuter times, so a moving time outside the rush hours often helps.\n\nThe housing is mostly suburban: 1930s semis and detached houses, Victorian terraces in Chipping Barnet and Finchley, and purpose-built flats near the stations. Hampstead Garden Suburb, with its Arts and Crafts houses, has some narrow roads, so tell us about access when you book.\n\nFor a studio or one-bedroom flat, 1 Man with the van may be enough. A family house in Finchley or Mill Hill usually calls for 2 Men or 3 Men and a longer booking. If you are unsure, pick Not Sure and we will advise.\n\nBarnet Council deals with parking suspensions, so ask for one ahead of your date and check its current lead times. Busy high streets can have loading limits, so tell us when you book if the van is likely to park some distance from your door.",
    areas: [
      "Chipping Barnet",
      "High Barnet",
      "East Barnet",
      "Whetstone",
      "Finchley",
      "Hendon",
      "Mill Hill",
      "Golders Green",
    ],
    faqs: [
      {
        q: "What does a man and van cost in Barnet?",
        a: "Prices start from £130, which covers the first two hours with one mover and a van, and extra time is charged by the hour. Larger family homes can mean a lot to load, so list your big items in the booking form. A bigger team costs more, and floors, lift access and the distance between your addresses count too. Give both addresses and your floor details, and the online quote will price your move before you book.",
      },
      {
        q: "Which parts of Barnet do you cover?",
        a: "We cover the London Borough of Barnet, including Chipping Barnet and High Barnet (EN5), East Barnet (EN4), Whetstone (N20), Finchley (N3, N12), Hendon (NW4), Mill Hill (NW7) and Golders Green (NW11). Not sure whether your street counts as Barnet? Message us the postcode and we will tell you.",
      },
      {
        q: "Can you move me from Hampstead Garden Suburb?",
        a: "Yes. Some roads there are narrow, so tell us about access in the booking form.",
      },
      {
        q: "Can you take furniture apart for a narrow staircase?",
        a: "Yes, if it needs to come apart. Turn on Dismantling required at pickup and Reassembly required at delivery in the booking form, and add your beds, sofas and other large items to the Furniture inventory so the time is planned properly.",
      },
      {
        q: "How do I park a removal van in Barnet?",
        a: "It depends on your street. Where parking is controlled, Barnet Council can arrange a suspension, so apply early and check its current lead times. Tell us when you book if the van is likely to park some distance from your door.",
      },
    ],
    postcode: 'EN5',
  },
  {
    slug: 'bexley',
    name: "Bexley",
    title: "Removals Bexley | Man & Van DA5 from £130",
    description: "Man and van removals in Bexley from £130 for the first two hours, then hourly. Flats and houses across DA5, DA6, DA14 and DA16. Get an instant quote.",
    hero: {
      eyebrow: "Removals in Bexley",
      title: "Removals in Bexley — Man & Van in DA5",
      subtitle: "Removals in Bexley, Bexleyheath, Sidcup and Welling with a man and van team. Prices from £130 for the first two hours, then hourly, with same-day moves when we have space.",
    },
    about: "Bexley is in the south-east of London, on the border with Kent. Postcodes include Bexley (DA5), Bexleyheath (DA6, DA7), Sidcup (DA14, DA15), Welling (DA16), Erith (DA8), Belvedere (DA17) and Crayford (DA1). Tell us both addresses when you book, as we use them to work out distance and time.\n\nBexley has no Tube stations, so most people travel by Southeastern train or by road. The A2, the A20 and the A206 are the main routes, and the M25 and the Dartford Crossing are not far, so these roads can be slow at commuter times. Where you can, choose a moving time outside the rush hours.\n\nThe housing is mostly suburban: 1930s semis in Sidcup, Bexleyheath and Welling, Victorian terraces nearer Erith, and newer flats along the riverside. Many homes have driveways, which usually makes loading easier. Older terraces can have narrow hallways and steep stairs, so a wardrobe or bed frame may need to come apart.\n\nFor a studio or one-bedroom flat, 1 Man with the van may be enough. A three-bedroom family house in Sidcup or Bexleyheath usually calls for 2 Men or 3 Men and a longer booking. If you are unsure, pick Not Sure and we will advise.\n\nBexley Council deals with parking suspensions, so ask for one ahead of your date and check its current lead times. Tell us when you book if the van is likely to park some distance from your door, or if you live in a block with a lift or loading rules.",
    areas: [
      "Bexley",
      "Bexleyheath",
      "Sidcup",
      "Welling",
      "Erith",
      "Crayford",
      "Belvedere",
      "Barnehurst",
    ],
    faqs: [
      {
        q: "What does a man and van cost in Bexley?",
        a: "Prices start from £130, which covers the first two hours with one mover and a van, and extra time is charged by the hour. Moves from family houses can mean a lot to load, so list your large items in the booking form. A bigger team costs more, and floors, lift access and the distance between your addresses count too. Enter both addresses in the online quote and you will see the price before you book anything.",
      },
      {
        q: "Which parts of Bexley do you cover?",
        a: "We cover the London Borough of Bexley, including Bexley (DA5), Bexleyheath (DA6, DA7), Sidcup (DA14, DA15), Welling (DA16), Erith (DA8), Belvedere (DA17) and Crayford (DA1). If you are unsure whether your address is in the borough, message us the postcode.",
      },
      {
        q: "Can you move a large family house in Bexley?",
        a: "Yes. Many homes in Sidcup, Bexleyheath and Welling are three-bedroom semis. Tell us how many rooms and large items you are moving, and choose 2 Men or 3 Men online. If you are not sure which suits you, we will help you pick.",
      },
      {
        q: "Can you take furniture apart for a narrow staircase?",
        a: "Yes, if it needs to come apart. Turn on Dismantling required at pickup and Reassembly required at delivery in the booking form, and add your beds, sofas and other large items to the Furniture inventory so the time is planned properly.",
      },
      {
        q: "How do I park a removal van in Bexley?",
        a: "It depends on your street. Where parking is controlled, Bexley Council can arrange a suspension, so apply early and check its current lead times. Tell us when you book if the van is likely to park some distance from your door.",
      },
    ],
    postcode: 'DA5',
  },
  {
    slug: 'wembley',
    name: "Wembley",
    title: "Removals Wembley | Man & Van HA9 from £130",
    description: "Man and van removals in Wembley from £130 for the first two hours, then hourly. Flats and houses across HA9, HA0, NW10 and NW2. Get an instant quote.",
    hero: {
      eyebrow: "Removals in Wembley",
      title: "Removals in Wembley — Man & Van in HA9",
      subtitle: "Removals in Wembley, Harlesden, Willesden and Kingsbury with a man and van team. Prices from £130 for the first two hours, then hourly, with same-day moves when we have space.",
    },
    about: "Wembley is in the London Borough of Brent, in North West London. Postcodes include Wembley (HA9), Alperton and Sudbury (HA0), Harlesden and Neasden (NW10), Willesden (NW10, NW2) and Kingsbury (NW9). Tell us both addresses when you book, as we use them to work out distance and time.\n\nWembley Park is on the Jubilee and Metropolitan lines, and Wembley Central is served by the Bakerloo line and the Overground. Events at Wembley Stadium and the OVO Arena bring road closures and heavy traffic to the area, so check the event calendar for your moving date. The North Circular is also busy at commuter times.\n\nThe housing is a mix of Edwardian terraces in Harlesden and Willesden, 1930s semis in Wembley and Sudbury, and many new-build flats around Wembley Park. Newer blocks often have a lift and a concierge, and some need the lift booked or have set hours for moves. Terraced houses can have narrow hallways and steep stairs, so a wardrobe or bed frame may need to come apart.\n\nFor a studio or one-bedroom flat, 1 Man with the van may be enough. A family house in Wembley or Willesden usually calls for 2 Men or 3 Men and a longer booking. If you are unsure, pick Not Sure and we will advise.\n\nBrent Council deals with parking suspensions, so ask for one ahead of your date and check its current lead times. Streets near the stadium can have event-day restrictions, so tell us when you book if the van is likely to park some distance from your door.",
    areas: [
      "Wembley",
      "Wembley Park",
      "Harlesden",
      "Willesden",
      "Neasden",
      "Alperton",
      "Sudbury",
      "Kingsbury",
    ],
    faqs: [
      {
        q: "What does a man and van cost in Wembley?",
        a: "Prices start from £130, which covers the first two hours with one mover and a van, and extra time is charged by the hour. Moves from Wembley Park flats can involve lifts and loading rules, so mention these in the booking form. A bigger team costs more, and floors, lift access and the distance between your addresses count too. Start the online quote with both postcodes to see your price.",
      },
      {
        q: "Which parts of Wembley do you cover?",
        a: "We cover Wembley and the London Borough of Brent, including Wembley (HA9), Alperton and Sudbury (HA0), Harlesden and Neasden (NW10), Willesden (NW10, NW2) and Kingsbury (NW9). Message us your postcode if you want to check before you book.",
      },
      {
        q: "Do Wembley Stadium events affect my move?",
        a: "They can. Stadium and arena events bring road closures and heavy traffic around Wembley Park. Check the event calendar for your date, and tell us when you book if your address is close to the stadium.",
      },
      {
        q: "Can you take furniture apart for a narrow staircase?",
        a: "Yes, if it needs to come apart. Turn on Dismantling required at pickup and Reassembly required at delivery in the booking form, and add your beds, sofas and other large items to the Furniture inventory so the time is planned properly.",
      },
      {
        q: "How do I park a removal van in Wembley?",
        a: "It depends on your street. Where parking is controlled, Brent Council can arrange a suspension, so apply early and check its current lead times. Tell us when you book if the van is likely to park some distance from your door.",
      },
    ],
    postcode: 'HA9',
  },
  {
    slug: 'bromley',
    name: "Bromley",
    title: "Removals Bromley | Man & Van BR1 from £130",
    description: "Man and van removals in Bromley from £130 for the first two hours, then hourly. Flats and houses across BR1 to BR7 and SE20. Get an instant quote online.",
    hero: {
      eyebrow: "Removals in Bromley",
      title: "Removals in Bromley — Man & Van in BR1",
      subtitle: "Removals in Bromley, Beckenham, Orpington and Chislehurst with a man and van team. Prices from £130 for the first two hours, then hourly, with same-day moves when we have space.",
    },
    about: "Bromley is London's largest borough by area, so the postcodes cover a lot of ground: Bromley town (BR1, BR2), Beckenham (BR3), West Wickham (BR4), Orpington (BR5, BR6), Chislehurst (BR7) and Penge (SE20). Tell us both addresses when you book, as we use them to work out distance and time.\n\nBromley South and Bromley North are the main town stations, with Beckenham Junction, Orpington and Chislehurst on other lines. Because the borough is so large, journeys between its villages can take longer than the map suggests. Where you can, choose a moving time outside the rush hours.\n\nThe housing is mostly suburban: Victorian and Edwardian houses near the town centres, 1930s semis, and larger detached homes on the outer edges, many with driveways. The centres of Bromley and Beckenham also have flats, some in blocks with lifts and loading rules. Larger family homes often mean a lot to move, so list your large items in the Furniture inventory.\n\nFor a studio or one-bedroom flat, 1 Man with the van may be enough. A three or four-bedroom house in Orpington or Chislehurst usually calls for 2 Men or 3 Men and a longer booking. If you are unsure, pick Not Sure and we will advise.\n\nBromley Council deals with parking suspensions, so ask for one ahead of your date and check its current lead times. Many outer streets have easy parking, but town centre roads can be tighter, so tell us when you book if the van is likely to park some distance from your door.",
    areas: [
      "Bromley",
      "Beckenham",
      "Orpington",
      "Chislehurst",
      "West Wickham",
      "Penge",
      "Hayes",
      "Petts Wood",
    ],
    faqs: [
      {
        q: "What does a man and van cost in Bromley?",
        a: "Prices start from £130, which covers the first two hours with one mover and a van, and extra time is charged by the hour. Larger Bromley family homes can mean a lot to load, so list your big items in the booking form. A bigger team costs more, and floors, lift access and the distance between your addresses count too. Fill in the quote form once and the full price is in front of you before you book.",
      },
      {
        q: "Do you cover Orpington, Beckenham and Chislehurst?",
        a: "Yes. We cover the London Borough of Bromley, including Bromley (BR1, BR2), Beckenham (BR3), West Wickham (BR4), Orpington (BR5, BR6), Chislehurst (BR7) and Penge (SE20). If your village or street is not listed, ask us and we will tell you whether we cover it.",
      },
      {
        q: "Can you move a large family house in Bromley?",
        a: "Yes. Tell us how many rooms and large items you are moving, and choose 2 Men or 3 Men online. For a larger house, 3 Men is usually the safer choice, and if you are not sure we will help you pick.",
      },
      {
        q: "Can you take furniture apart for a narrow staircase?",
        a: "Yes, if it needs to come apart. Turn on Dismantling required at pickup and Reassembly required at delivery in the booking form, and add your beds, sofas and other large items to the Furniture inventory so the time is planned properly.",
      },
      {
        q: "How do I park a removal van in Bromley?",
        a: "It depends on your street. Where parking is controlled, Bromley Council can arrange a suspension, so apply early and check its current lead times. Tell us when you book if the van is likely to park some distance from your door.",
      },
    ],
    postcode: 'BR1',
  },
  {
    slug: 'ealing',
    name: "Ealing",
    title: "Removals Ealing | Man & Van W5 from £130",
    description: "Man and van removals in Ealing from £130 for the first two hours, then hourly. Flats and houses across W5, W13, W7, UB1 and UB6. Get an instant quote.",
    hero: {
      eyebrow: "Removals in Ealing",
      title: "Removals in Ealing — Man & Van in W5",
      subtitle: "Removals in Ealing, West Ealing, Acton, Hanwell and Southall with a man and van team. Prices from £130 for the first two hours, then hourly, with same-day moves when we have space.",
    },
    about: "Ealing is a large borough in West London, often called the Queen of the Suburbs. Postcodes include Ealing (W5), West Ealing (W13), Hanwell (W7), Acton (W3), Southall (UB1), Northolt (UB5) and Greenford (UB6). Tell us both addresses when you book, as we use them to work out distance and time.\n\nEaling Broadway, West Ealing, Hanwell and Southall stations are on the Elizabeth line. The Central line serves Ealing Broadway, West Acton, North Acton and Greenford. The A40, the North Circular and the Uxbridge Road are busy at commuter times, so a moving time outside the rush hours often helps.\n\nThe housing is mostly Edwardian and Victorian terraces and semis, 1930s homes in Greenford and Northolt, and a growing number of new-build flats around the stations. Terraced houses often have narrow hallways and steep stairs, so a wardrobe or bed frame may need to come apart. If you need this, turn on Dismantling required and Reassembly required under Furniture services, and add your large items to the Furniture inventory.\n\nFor a studio or one-bedroom flat, 1 Man with the van may be enough. A family house in Ealing or Hanwell usually calls for 2 Men or 3 Men and a longer booking. If you are unsure, pick Not Sure and we will advise.\n\nEaling Council deals with parking suspensions, so ask for one ahead of your date and check its current lead times. Near the stations, parking is more tightly controlled, so tell us when you book if the van is likely to park some distance from your door.",
    areas: [
      "Ealing",
      "West Ealing",
      "Acton",
      "Hanwell",
      "Southall",
      "Northolt",
      "Greenford",
      "Perivale",
    ],
    faqs: [
      {
        q: "What does a man and van cost in Ealing?",
        a: "Prices start from £130, which covers the first two hours with one mover and a van, and extra time is charged by the hour. Moves in Ealing often involve stairs in terraced houses and parking some way from the door, so mention both in the booking form. A bigger team costs more, and floors, lift access and the distance between your addresses count too. Try the online quote with your postcodes and you will see the price before you book.",
      },
      {
        q: "Which parts of Ealing do you cover?",
        a: "We cover Ealing, including Ealing (W5), West Ealing (W13), Hanwell (W7), Acton (W3), Southall (UB1), Northolt (UB5) and Greenford (UB6). Check with us by phone or message if your street is near the borough edge.",
      },
      {
        q: "Do you offer same-day removals in Ealing?",
        a: "In many cases, yes, when we have a team free. Select today's date in the booking form to see the earliest time still available. If online booking for today has closed, choose another date or contact us directly.",
      },
      {
        q: "Can you take furniture apart for a narrow staircase?",
        a: "Yes, if it needs to come apart. Turn on Dismantling required at pickup and Reassembly required at delivery in the booking form, and add your beds, sofas and other large items to the Furniture inventory so the time is planned properly.",
      },
      {
        q: "How do I park a removal van in Ealing?",
        a: "It depends on your street. Where parking is controlled, Ealing Council can arrange a suspension, so apply early and check its current lead times. Tell us when you book if the van is likely to park some distance from your door.",
      },
    ],
    postcode: 'W5',
  },
  {
    slug: 'enfield',
    name: "Enfield",
    title: "Removals Enfield | Man & Van EN1 from £130",
    description: "Man and van removals in Enfield from £130 for the first two hours, then hourly. Flats and houses across EN1, EN2, EN3, N9, N13, N14, N21. Instant quote.",
    hero: {
      eyebrow: "Removals in Enfield",
      title: "Removals in Enfield — Man & Van in EN1",
      subtitle: "Removals in Enfield, Edmonton, Palmers Green and Southgate with a man and van team. Prices from £130 for the first two hours, then hourly, with same-day moves when we have space.",
    },
    about: "Enfield is one of London's northernmost boroughs, running up to the M25. Postcodes include Enfield Town and Bush Hill Park (EN1), Enfield Chase (EN2), Ponders End and Enfield Lock (EN3), Edmonton (N9, N18), Palmers Green (N13), Southgate (N14) and Winchmore Hill (N21). Tell us both addresses when you book, as we use them to work out distance and time.\n\nEnfield Town, Enfield Chase and Southbury are served by the Overground and rail lines, Palmers Green and Winchmore Hill by trains into central London, and the Piccadilly line reaches Southgate and Oakwood. The A10, the A406 North Circular and the M25 are close, and they are busy at commuter times, so a moving time outside the rush hours often helps.\n\nThe housing is mixed: Victorian and Edwardian terraces in Enfield Town and Edmonton, 1930s semis and larger family homes in Southgate and Winchmore Hill, and newer flats around the stations. Terraced houses often have narrow hallways and steep stairs, so a wardrobe or bed frame may need to come apart.\n\nFor a studio or one-bedroom flat, 1 Man with the van may be enough. A family house in Southgate or Winchmore Hill usually calls for 2 Men or 3 Men and a longer booking. If you are unsure, pick Not Sure and we will advise.\n\nEnfield Council deals with parking suspensions, so ask for one ahead of your date and check its current lead times. Streets near the town centre and stations can be tight, so tell us when you book if the van is likely to park some distance from your door.",
    areas: [
      "Enfield Town",
      "Edmonton",
      "Palmers Green",
      "Southgate",
      "Winchmore Hill",
      "Ponders End",
      "Enfield Lock",
      "Oakwood",
    ],
    faqs: [
      {
        q: "What does a man and van cost in Enfield?",
        a: "Prices start from £130, which covers the first two hours with one mover and a van, and extra time is charged by the hour. Moves from terraced houses often involve stairs and parking some way from the door, so mention both in the booking form. A bigger team costs more, and floors, lift access and the distance between your addresses count too. Put your postcodes into the booking form to see your price for the move you actually have.",
      },
      {
        q: "Which parts of Enfield do you cover?",
        a: "We cover the London Borough of Enfield, including Enfield Town (EN1), Enfield Chase (EN2), Ponders End and Enfield Lock (EN3), Edmonton (N9, N18), Palmers Green (N13), Southgate (N14) and Winchmore Hill (N21). If your address is close to the Hertfordshire border, ask us before you book.",
      },
      {
        q: "Can you move me from Enfield to outside London?",
        a: "Our online booking covers London and the area inside the M25. For anywhere further, use the custom quote form and we will look at your move.",
      },
      {
        q: "Can you take furniture apart for a narrow staircase?",
        a: "Yes, if it needs to come apart. Turn on Dismantling required at pickup and Reassembly required at delivery in the booking form, and add your beds, sofas and other large items to the Furniture inventory so the time is planned properly.",
      },
      {
        q: "How do I park a removal van in Enfield?",
        a: "It depends on your street. Where parking is controlled, Enfield Council can arrange a suspension, so apply early and check its current lead times. Tell us when you book if the van is likely to park some distance from your door.",
      },
    ],
    postcode: 'EN1',
  },
  {
    slug: 'hammersmith',
    name: "Hammersmith & Fulham",
    title: "Removals Hammersmith & Fulham | Man & Van W6 from £130",
    description: "Man and van removals in Hammersmith and Fulham from £130 for the first two hours, then hourly. Homes across W6, W12, W14 and SW6. Get your instant quote.",
    hero: {
      eyebrow: "Removals in Hammersmith & Fulham",
      title: "Removals in Hammersmith & Fulham — Man & Van in W6",
      subtitle: "Removals in Hammersmith, Fulham, Shepherd's Bush and Brook Green with a man and van team. Prices from £130 for the first two hours, then hourly, with same-day moves when we have space.",
    },
    about: "The London Borough of Hammersmith and Fulham runs along the north bank of the Thames and takes in several postcodes: Hammersmith and Brook Green (W6), Shepherd's Bush and White City (W12), West Kensington and Barons Court (W14), and Fulham and Parsons Green (SW6). We use your pickup and delivery addresses to work out distance and time, so enter both when you book.\n\nFootball can affect your moving day. Chelsea play at Stamford Bridge and Fulham at Craven Cottage, both in the borough, and QPR play at Loftus Road in Shepherd's Bush, so nearby roads are busier on match days. Check the fixtures when you choose your date.\n\nHammersmith has stations on the District, Piccadilly, Hammersmith & City and Circle lines, and Shepherd's Bush and White City are on the Central line. Fulham Broadway and Parsons Green are on the District line, and Barons Court is on the District and Piccadilly lines. The A4 runs over the Hammersmith flyover, and Hammersmith Broadway is busy at peak times.\n\nHousing includes Victorian terraces in Fulham and Brook Green, red-brick mansion blocks around Barons Court and West Kensington, riverside developments such as Imperial Wharf, and larger estates and newer blocks around White City. Many older houses have been converted into flats with steep stairs, so add your large items to the Furniture inventory and turn on Dismantling required and Reassembly required if something needs to come apart.\n\nHammersmith & Fulham Council deals with parking suspensions. In controlled parking zones, arrange one with the council ahead of your date, and check its current lead times. A one-bedroom flat in Shepherd's Bush might suit 1 Man, while a three-storey house in Fulham is likely to need 2 Men or 3 Men for a longer booking. The booking form also has a Not Sure option if you would like advice.",
    areas: [
      "Hammersmith",
      "Fulham",
      "Shepherd's Bush",
      "Brook Green",
      "Parsons Green",
      "Barons Court",
      "White City",
      "West Kensington",
      "Imperial Wharf",
    ],
    faqs: [
      {
        q: "What does a man and van cost in Hammersmith and Fulham?",
        a: "Prices start from £130 for the first two hours with one mover and a van, then extra time is charged by the hour. A flat near Hammersmith Broadway and a house in Fulham are different jobs, and traffic around the Broadway at peak times or on match days can add time, so choose your date with that in mind. Team size, floors and lift access change the price as well. The instant quote shows it before you book.",
      },
      {
        q: "Which parts of Hammersmith and Fulham do you cover?",
        a: "We cover Hammersmith and Fulham, including Hammersmith and Brook Green (W6), Shepherd's Bush and White City (W12), West Kensington and Barons Court (W14), and Fulham and Parsons Green (SW6). If you are unsure whether your address is included, call or message us.",
      },
      {
        q: "Do football match days affect a move in Fulham?",
        a: "They can. Roads near Stamford Bridge, Craven Cottage and Loftus Road are busier on match days, so check the fixtures and choose a time to suit. If your date is a match day, tell us in the booking notes.",
      },
      {
        q: "Can you move me out of a riverside flat in Fulham?",
        a: "Yes. Check your building's rules for lift bookings and loading before your date, and mention the floor, the lift and the carrying distance in the booking notes. Add large items to the Furniture inventory so the time is planned properly.",
      },
      {
        q: "Can I get a same-day removal in Hammersmith and Fulham?",
        a: "In many cases, yes. Choose today's date in the booking form to see the earliest time left. If online booking for today has closed, pick another date or contact us directly.",
      },
    ],
    postcode: 'W6',
  },
  {
    slug: 'tottenham',
    name: "Tottenham",
    title: "Removals Tottenham | Man & Van N17 from £130",
    description: "Man and van removals in Tottenham from £130 for the first two hours, then hourly. Flats and houses across N17, N15 and N22. Get an instant quote online.",
    hero: {
      eyebrow: "Removals in Tottenham",
      title: "Removals in Tottenham — Man & Van in N17",
      subtitle: "Removals in Tottenham, Seven Sisters, Tottenham Hale and Wood Green with a man and van team. Prices from £130 for the first two hours, then hourly, with same-day moves when we have space.",
    },
    about: "Tottenham is in the London Borough of Haringey, in North London. Postcodes include Tottenham, Bruce Grove and Tottenham Hale (N17), South Tottenham and Seven Sisters (N15) and Wood Green (N22). Tell us both addresses when you book, as we use them to work out distance and time.\n\nSeven Sisters and Tottenham Hale are on the Victoria line, and Seven Sisters, Bruce Grove and White Hart Lane are on the Overground. The A10 High Road is busy all day, and on match days and event days the roads around Tottenham Hotspur Stadium are much slower, with parking restrictions. Check your date before you book.\n\nThe housing is a mix of Victorian and Edwardian terraces, many split into flats, council estates and new-build apartment blocks around Tottenham Hale. Older conversions can have narrow stairs and shared entrances, and newer blocks often have a lift and a concierge with set hours for moves. A wardrobe or bed frame may need to come apart.\n\nFor a studio or one-bedroom flat, 1 Man with the van may be enough. A larger flat or a family house usually calls for 2 Men or 3 Men and a longer booking. If you are unsure, pick Not Sure and we will advise.\n\nHaringey Council deals with parking suspensions, so ask for one ahead of your date and check its current lead times. Tell us when you book if the van is likely to park some distance from your door.",
    areas: [
      "Tottenham",
      "Tottenham Hale",
      "Seven Sisters",
      "Bruce Grove",
      "White Hart Lane",
      "South Tottenham",
      "Wood Green",
      "Harringay",
    ],
    faqs: [
      {
        q: "What does a man and van cost in Tottenham?",
        a: "Prices start from £130, which covers the first two hours with one mover and a van, and extra time is charged by the hour. Moves from converted houses and new blocks can involve stairs, lifts and loading rules, so mention these in the booking form. A bigger team costs more, and floors, lift access and the distance between your addresses count too. Fill in the instant quote with your postcodes and your own price appears before you book.",
      },
      {
        q: "Which parts of Tottenham do you cover?",
        a: "We cover Tottenham and the London Borough of Haringey, including Tottenham, Bruce Grove and Tottenham Hale (N17), South Tottenham and Seven Sisters (N15) and Wood Green (N22). For addresses on the Haringey and Enfield border, call or message us and we will check.",
      },
      {
        q: "Do Tottenham Hotspur Stadium events affect my move?",
        a: "They can. Match days and events bring heavy traffic and parking restrictions around the stadium. Check the calendar for your date, and tell us when you book if your address is close to the stadium.",
      },
      {
        q: "Can you take furniture apart for a narrow staircase?",
        a: "Yes, if it needs to come apart. Turn on Dismantling required at pickup and Reassembly required at delivery in the booking form, and add your beds, sofas and other large items to the Furniture inventory so the time is planned properly.",
      },
      {
        q: "How do I park a removal van in Tottenham?",
        a: "It depends on your street. Where parking is controlled, Haringey Council can arrange a suspension, so apply early and check its current lead times. Tell us when you book if the van is likely to park some distance from your door.",
      },
    ],
    postcode: 'N17',
  },
  {
    slug: 'harrow',
    name: "Harrow",
    title: "Removals Harrow | Man & Van HA1 from £130",
    description: "Removals in Harrow with a man and van from £130 for the first two hours, then hourly. Houses and flats across HA1, HA2, HA3 and HA5. Get a quote online.",
    hero: {
      eyebrow: "Removals in Harrow",
      title: "Removals in Harrow — Man & Van in HA1",
      subtitle: "Removals in Harrow, Pinner, Stanmore and Kenton, from family houses to town-centre flats. Prices from £130 for the first two hours, then charged hourly, with same-day moves when we have space.",
    },
    about: "Harrow is mainly a suburban borough in north-west London. Many streets are family houses, including the 1930s semi-detached homes that grew up along the Metropolitan line, so moves here are often whole-house moves with bigger loads and extra spaces to clear, such as lofts, garages and sheds. When you book, tell us about any of these so we can plan enough time.\n\nOur postcode coverage includes HA1 (Harrow town centre and Harrow on the Hill), HA2 (South Harrow and Rayners Lane), HA3 (Kenton and Wealdstone), HA5 (Pinner) and HA7 (Stanmore).\n\nHarrow on the Hill and some of the streets around it sit on a slope, which can make the carry from the van to the front door harder. If your address is up a hill, has a long driveway or steps up from the road, say so when you book. Harrow town centre and Wealdstone also have blocks of flats, where we need to know about the lift and parking arrangements.\n\nHarrow Council handles parking suspensions. If you need a space kept clear outside your address, contact the council early and check its current lead times.\n\nThe area has good rail links. Metropolitan line trains run from Harrow-on-the-Hill and Pinner, the Jubilee line runs to Stanmore, and the Bakerloo line and London Overground serve Harrow & Wealdstone. For a bigger family move, 3 Men and a longer booking are often the safer choice, and you can choose the team size online when you book.\n\nTo keep a house move on schedule, pack and label boxes by room before we arrive, empty drawers that cannot be carried full, and take down curtain poles and shelves in advance. Measure large furniture against doorways and stair turns, and move cars off the drive so the van can park as close as possible. Anything stored in a loft or garage is best brought down beforehand.",
    areas: [
      "Harrow on the Hill",
      "Harrow Town",
      "Pinner",
      "Wealdstone",
      "Kenton",
      "Stanmore",
      "Rayners Lane",
      "North Harrow",
    ],
    faqs: [
      {
        q: "How much does it cost to move house in Harrow?",
        a: "Prices begin at £130 for the first two hours with one mover and a van, then extra time is charged by the hour. A family house usually needs more movers and more hours than a flat, and many homes around Harrow and Pinner are houses, so check the team size when you get your quote. Enter your postcodes in the instant quote to see your price.",
      },
      {
        q: "Can you move a large family house in Harrow?",
        a: "Yes. Tell us the number of bedrooms and any big items, such as a large wardrobe or sofa, in the booking form, then choose a team size to match. 3 Men is often the better choice for bigger homes.",
      },
      {
        q: "Do you cover Pinner, Stanmore, Kenton and Wealdstone?",
        a: "Yes. We cover Harrow, including HA1, HA2, HA3, HA5 and HA7. If you are unsure whether your address is included, call or message us.",
      },
      {
        q: "Do I need a parking suspension for a removal in Harrow?",
        a: "It is worth arranging if there is no easy parking near your door. Harrow Council handles suspensions, so check its current rules and lead times and apply ahead of your date. Tell us when you book if the van will have to park some distance away.",
      },
      {
        q: "Can you do a same-day removal in Harrow?",
        a: "Often, if we have a team free. Pick today's date in the booking form to see the earliest time left. If online booking for today is closed, choose another date or contact us directly.",
      },
    ],
    postcode: 'HA1',
  },
  {
    slug: 'hounslow',
    name: "Hounslow",
    title: "Removals Hounslow | Man & Van TW3 from £130",
    description: "Man and van removals in Hounslow from £130 for the first two hours, then hourly. Flats and houses across TW3, TW5, TW7, TW8 and W4. Get an instant quote.",
    hero: {
      eyebrow: "Removals in Hounslow",
      title: "Removals in Hounslow — Man & Van in TW3",
      subtitle: "Removals in Hounslow, Isleworth, Brentford, Feltham and Chiswick with a man and van team. Prices from £130 for the first two hours, then hourly, with same-day moves when we have space.",
    },
    about: "Hounslow is a West London borough that borders Heathrow. Postcodes include Hounslow (TW3, TW4), Heston and Cranford (TW5), Isleworth (TW7), Brentford (TW8), Feltham (TW13, TW14) and Chiswick (W4). Tell us both addresses when you book, as we use them to work out distance and time.\n\nThe Piccadilly line serves Hounslow East, Hounslow Central and Hounslow West, and South Western Railway serves Feltham, Isleworth, Brentford and Chiswick. The M4, the A4 Great West Road and the A316 are busy at commuter times, and traffic around Heathrow can slow things further, so a moving time outside the rush hours often helps.\n\nThe housing is a mix of 1930s semis in Hounslow and Feltham, Victorian terraces in Brentford and Isleworth, riverside flats around Brentford, and larger Victorian and Edwardian houses in Chiswick. Terraced houses often have narrow hallways and steep stairs, so a wardrobe or bed frame may need to come apart.\n\nFor a studio or one-bedroom flat, 1 Man with the van may be enough. A family house in Hounslow, Isleworth or Chiswick usually calls for 2 Men or 3 Men and a longer booking. If you are unsure, pick Not Sure and we will advise.\n\nHounslow Council deals with parking suspensions, so ask for one ahead of your date and check its current lead times. Tell us when you book if the van is likely to park some distance from your door, or if you live in a block with a lift or loading rules.",
    areas: [
      "Hounslow",
      "Isleworth",
      "Brentford",
      "Feltham",
      "Chiswick",
      "Heston",
      "Cranford",
      "Hanworth",
    ],
    faqs: [
      {
        q: "What does a man and van cost in Hounslow?",
        a: "Prices start from £130, which covers the first two hours with one mover and a van, and extra time is charged by the hour. Moves from terraced houses and riverside flats can involve stairs, lifts and parking some way from the door, so mention these in the booking form. A bigger team costs more, and floors, lift access and the distance between your addresses count too. A few details in the online quote give you a price for your own move before you commit.",
      },
      {
        q: "Which parts of Hounslow do you cover?",
        a: "We cover the London Borough of Hounslow, including Hounslow (TW3, TW4), Heston and Cranford (TW5), Isleworth (TW7), Brentford (TW8), Feltham (TW13, TW14) and Chiswick (W4). If your street sits near the Ealing or Richmond boundary, a quick call or message will confirm.",
      },
      {
        q: "Does Heathrow traffic affect my move in Hounslow?",
        a: "It can. The M4, the A4 and the A316 are busy at commuter times, and airport traffic can slow them further. Choosing a time outside the rush hours helps, and tell us when you book if either address is close to the airport.",
      },
      {
        q: "Can you take furniture apart for a narrow staircase?",
        a: "Yes, if it needs to come apart. Turn on Dismantling required at pickup and Reassembly required at delivery in the booking form, and add your beds, sofas and other large items to the Furniture inventory so the time is planned properly.",
      },
      {
        q: "How do I park a removal van in Hounslow?",
        a: "It depends on your street. Where parking is controlled, Hounslow Council can arrange a suspension, so apply early and check its current lead times. Tell us when you book if the van is likely to park some distance from your door.",
      },
    ],
    postcode: 'TW3',
  },
  {
    slug: 'kensington',
    name: "Kensington",
    title: "Removals Kensington | Man & Van W8 from £130",
    description: "Man and van removals in Kensington and Chelsea from £130 for the first two hours, then hourly. Flats and houses in W8, W11, W14 and SW3. Instant quote.",
    hero: {
      eyebrow: "Removals in Kensington",
      title: "Removals in Kensington — Man & Van in W8",
      subtitle: "Removals in Kensington, Chelsea, Notting Hill and Earl's Court with a man and van team. Prices from £130 for the first two hours, then hourly, with same-day moves when we have space.",
    },
    about: "The Royal Borough of Kensington and Chelsea runs from Notting Hill and North Kensington in the north down to Chelsea and the river. Postcodes include Kensington (W8), Holland Park and Notting Hill (W11), Olympia (W14), Chelsea (SW3, SW10) and Earl's Court (SW5). Tell us both addresses when you book, as we use them to work out distance and time.\n\nMost of the housing is flats and townhouses: white stucco terraces, mansion blocks, mews houses and purpose-built apartment buildings. Many have steep or narrow stairs, and some have a lift that is only for residents or has to be booked. A wardrobe or bed frame may need to come apart, and if you need this, turn on Dismantling required and Reassembly required under Furniture services and add your large items to the Furniture inventory.\n\nThe streets are quiet in places and very busy in others, such as the King's Road, Kensington High Street and Portobello Road on market days. Events at Olympia (W14) can also bring extra traffic to the area. Choosing a time outside the rush hours helps, and it is worth telling us if your street has narrow access or loading limits.\n\nFor a studio or one-bedroom flat, 1 Man with the van may be enough. A family townhouse usually calls for 2 Men or 3 Men and a longer booking. If you are unsure, pick Not Sure and we will advise.\n\nThe Royal Borough of Kensington and Chelsea deals with parking suspensions, and parking is tightly controlled in much of the borough, so ask for one well ahead of your date and check its current lead times.",
    areas: [
      "Kensington",
      "Chelsea",
      "Notting Hill",
      "Holland Park",
      "Earl's Court",
      "South Kensington",
      "North Kensington",
      "West Brompton",
    ],
    faqs: [
      {
        q: "What does a man and van cost in Kensington?",
        a: "Prices start from £130, which covers the first two hours with one mover and a van, and extra time is charged by the hour. Moves here often involve stairs, lifts and parking some way from the door, so mention these in the booking form. A bigger team costs more, and floors, lift access and the distance between your addresses count too. You will see the full price in the instant quote before you book.",
      },
      {
        q: "Do you cover Chelsea, Notting Hill and Earl's Court?",
        a: "Yes. We cover the borough, including Kensington (W8), Holland Park and Notting Hill (W11), Olympia (W14), Chelsea (SW3, SW10) and Earl's Court (SW5). If you are not sure your address is covered, just call or message us.",
      },
      {
        q: "Can you take furniture apart for narrow stairs?",
        a: "Yes, if it needs to come apart. Turn on Dismantling required at pickup and Reassembly required at delivery in the booking form, and add your beds, sofas and other large items to the Furniture inventory so the time is planned properly.",
      },
      {
        q: "Can you move me from a building with strict access rules?",
        a: "Many mansion blocks and apartment buildings have set hours for moves or need the lift booked. Check with your building manager, and tell us the details in the booking form so the time is planned properly.",
      },
      {
        q: "How do I park a removal van in Kensington?",
        a: "Parking is tightly controlled in much of the borough. The Royal Borough of Kensington and Chelsea can arrange a suspension, so apply early and check its current lead times. Tell us when you book if the van is likely to park some distance from your door.",
      },
    ],
    postcode: 'W8',
  },
  {
    slug: 'kingston',
    name: "Kingston",
    title: "Removals Kingston | Man & Van KT1 from £130",
    description: "Man and van removals in Kingston from £130 for the first two hours, then hourly. Flats and houses across KT1, KT2, KT3, KT5, KT6 and KT9. Instant quote.",
    hero: {
      eyebrow: "Removals in Kingston",
      title: "Removals in Kingston — Man & Van in KT1",
      subtitle: "Removals in Kingston, Surbiton, New Malden and Tolworth with a man and van team. Prices from £130 for the first two hours, then hourly, with same-day moves when we have space.",
    },
    about: "Kingston upon Thames is a Royal Borough in South West London. Postcodes include Kingston (KT1, KT2), New Malden (KT3), Surbiton (KT5, KT6), Tolworth (KT6) and Chessington (KT9). Tell us both addresses when you book, as we use them to work out distance and time.\n\nKingston has no Tube station, so most people travel by South Western Railway or by road. Kingston Bridge, the A3 and the roads around the town centre can back up at commuter times, so a moving time outside the rush hours often helps.\n\nThe housing is a mix of Victorian villas and terraces in Surbiton and Norbiton, 1930s semis in Tolworth and Chessington, and flats around the town centre and the riverside. Riverside and town centre blocks often have a lift, a concierge and set hours for moves, and older houses can have steep stairs, so a wardrobe or bed frame may need to come apart.\n\nFor a studio or one-bedroom flat, 1 Man with the van may be enough. A family house in Surbiton or New Malden usually calls for 2 Men or 3 Men and a longer booking. If you are unsure, pick Not Sure and we will advise.\n\nThe Royal Borough of Kingston upon Thames deals with parking suspensions, so ask for one ahead of your date and check its current lead times. Tell us when you book if the van is likely to park some distance from your door.",
    areas: [
      "Kingston",
      "Surbiton",
      "New Malden",
      "Tolworth",
      "Chessington",
      "Norbiton",
      "Berrylands",
      "Hook",
    ],
    faqs: [
      {
        q: "What does a man and van cost in Kingston?",
        a: "Prices start from £130, which covers the first two hours with one mover and a van, and extra time is charged by the hour. Moves from riverside and town centre flats can involve lifts and loading rules, so mention these in the booking form. A bigger team costs more, and floors, lift access and the distance between your addresses count too. Try the booking form with your two postcodes and floor details to see your price.",
      },
      {
        q: "Which parts of Kingston do you cover?",
        a: "We cover the Royal Borough of Kingston upon Thames, including Kingston (KT1, KT2), New Malden (KT3), Surbiton (KT5, KT6), Tolworth (KT6) and Chessington (KT9). Not sure whether your road is in the Royal Borough? Ask us and we will check.",
      },
      {
        q: "Can you move me from a riverside flat in Kingston?",
        a: "Yes. Many riverside blocks have a lift, a concierge and set hours for moves. Check with your building manager, and tell us the floor and lift details in the booking form so the time is planned properly.",
      },
      {
        q: "Can you take furniture apart for a narrow staircase?",
        a: "Yes, if it needs to come apart. Turn on Dismantling required at pickup and Reassembly required at delivery in the booking form, and add your beds, sofas and other large items to the Furniture inventory so the time is planned properly.",
      },
      {
        q: "How do I park a removal van in Kingston?",
        a: "It depends on your street. Where parking is controlled, the Royal Borough of Kingston upon Thames can arrange a suspension, so apply early and check its current lead times. Tell us when you book if the van is likely to park some distance from your door.",
      },
    ],
    postcode: 'KT1',
  },
  {
    slug: 'lewisham',
    name: "Lewisham",
    title: "Removals Lewisham | Man & Van SE13 from £130",
    description: "Man and van removals in Lewisham from £130 for the first two hours, then hourly. Flats and houses across SE13, SE6 and SE4. Get your instant quote.",
    hero: {
      eyebrow: "Removals in Lewisham",
      title: "Removals in Lewisham — Man & Van in SE13",
      subtitle: "Removals in Lewisham, Catford, Brockley and Deptford with a friendly man and van team. Prices from £130 for the first two hours, then hourly, with same-day moves when we have space.",
    },
    about: "Lewisham is a borough of several distinct neighbourhoods rather than one centre: Lewisham town itself (SE13), Catford (SE6), Brockley (SE4), Deptford (SE8), Forest Hill (SE23) and Sydenham (SE26), among others. Because the postcodes differ so much, tell us both addresses when you book, as we use them to work out distance and time.\n\nRail and DLR links shape how people move here. Lewisham station has DLR and National Rail services, Catford and Catford Bridge have rail services, Brockley and Forest Hill are on the London Overground, and Deptford has National Rail and DLR services nearby. The A205 South Circular crosses the area, so it helps to avoid the busiest travel times when you choose your moving time.\n\nMany addresses are Victorian and Edwardian terraces, some converted into flats, so narrow hallways and steep stairs are common. There are also purpose-built blocks and newer developments, and in the south of the borough, around Downham and Bellingham, you will find many houses from the 1920s and 1930s. A one-bedroom flat in Brockley with a few large items might manage with 1 Man, while a family house in Catford or Downham is likely to need 2 Men or 3 Men for a longer booking. Choose the team that fits when you book.\n\nLewisham Council deals with parking suspensions. If your street is a controlled parking zone, ask the council for a suspension ahead of your date and check its current lead times. If parking is tight, mention it when you book so we can plan the loading with you.\n\nLewisham also works well as a starting point for longer moves. The A20 and A21 both run through the borough towards Kent and the M25, so a move out of London can begin without crossing the whole city first. For moves outside the M25, request a custom quote.",
    areas: [
      "Lewisham",
      "Catford",
      "Deptford",
      "Brockley",
      "Forest Hill",
      "Sydenham",
      "Hither Green",
      "Ladywell",
    ],
    faqs: [
      {
        q: "What does a man and van cost in Lewisham?",
        a: "From £130 for the first two hours with one mover and a van, then extra time is charged by the hour. Lewisham runs from Deptford in the north to Sydenham and Downham in the south, so the distance between your two addresses is a real part of the price, and so are floors and lift access. The instant quote shows the price before you book.",
      },
      {
        q: "Do you cover Catford, Brockley and Deptford?",
        a: "Yes. We cover Lewisham, including Lewisham town (SE13), Catford (SE6), Brockley (SE4), Deptford (SE8), Forest Hill (SE23) and Sydenham (SE26). If you are unsure whether your address is included, call or message us.",
      },
      {
        q: "Can I get a same-day removal in Lewisham?",
        a: "In many cases, yes. Choose today's date in the booking form to see the earliest time left. If online booking for today has closed, pick another date or contact us directly.",
      },
      {
        q: "Is there parking for a removal van in Lewisham?",
        a: "It depends on your street. Where parking is controlled, Lewisham Council can arrange a suspension, so apply early and check its current lead times. Tell us when you book if the van is likely to park some distance from your door.",
      },
      {
        q: "How many movers do I need for a two-bedroom flat in Lewisham?",
        a: "Many two-bedroom flats suit 2 Men, but upstairs flats with lots of furniture may need 3 Men. Choose 1 Man, 2 Men or 3 Men online, and if you are not sure pick Not Sure and we will advise.",
      },
    ],
    postcode: 'SE13',
  },
  {
    slug: 'wimbledon',
    name: "Wimbledon",
    title: "Removals Wimbledon | Man & Van SW19 from £130",
    description: "Man and van removals in Wimbledon from £130 for the first two hours, then hourly. Flats and houses across SW19, SW20, SM4 and CR4. Get an instant quote.",
    hero: {
      eyebrow: "Removals in Wimbledon",
      title: "Removals in Wimbledon — Man & Van in SW19",
      subtitle: "Removals in Wimbledon, Colliers Wood, Raynes Park and Mitcham with a man and van team. Prices from £130 for the first two hours, then hourly, with same-day moves when we have space.",
    },
    about: "Wimbledon sits in the London Borough of Merton, in South West London. Postcodes include Wimbledon, South Wimbledon and Colliers Wood (SW19), Raynes Park (SW20), Morden (SM4) and Mitcham (CR4). Tell us both addresses when you book, as we use them to work out distance and time.\n\nWimbledon station has the District line, Thameslink, South Western Railway and Tramlink, and the Northern line serves South Wimbledon, Colliers Wood and Morden. The roads around the town centre are busy at commuter times, so a moving time outside the rush hours often helps. During the tennis championships in summer, traffic around SW19 is heavier still, so check your date if you have a choice.\n\nThe housing varies a lot. Wimbledon Village, up the hill from the town centre, and the streets around Wimbledon Park have large Victorian and Edwardian houses. Colliers Wood and Mitcham have terraces and newer flats, and Raynes Park and Morden have many 1930s semis. Larger older houses can have long carries and steep stairs, so a wardrobe or bed frame may need to come apart.\n\nFor a studio or one-bedroom flat near the station, 1 Man with the van may be enough. A family house in Wimbledon Village or Wimbledon Park usually calls for 2 Men or 3 Men and a longer booking. If you are unsure, pick Not Sure and we will advise.\n\nMerton Council deals with parking suspensions, so ask for one ahead of your date and check its current lead times. Tell us when you book if the van is likely to park some distance from your door, or if you live in a block with a lift or loading rules.",
    areas: [
      "Wimbledon",
      "Wimbledon Village",
      "South Wimbledon",
      "Colliers Wood",
      "Raynes Park",
      "Morden",
      "Mitcham",
      "Wimbledon Park",
    ],
    faqs: [
      {
        q: "What does a man and van cost in Wimbledon?",
        a: "Prices start from £130, which covers the first two hours with one mover and a van, and extra time is charged by the hour. Moves from larger Wimbledon houses can involve long carries and stairs, so mention these in the booking form. A bigger team costs more, and floors, lift access and the distance between your addresses count too. Enter your pick-up and delivery postcodes in the booking form and your price appears straight away.",
      },
      {
        q: "Which parts of Wimbledon do you cover?",
        a: "We cover Wimbledon and the London Borough of Merton, including Wimbledon, South Wimbledon and Colliers Wood (SW19), Raynes Park (SW20), Morden (SM4) and Mitcham (CR4). If you are unsure which side of the borough boundary you are on, call or message us.",
      },
      {
        q: "Do the tennis championships affect my move in Wimbledon?",
        a: "Traffic and parking around SW19 are much busier during the Wimbledon Championships in summer. If your date is flexible, consider moving on a different day, and tell us when you book if your address is close to the All England Club.",
      },
      {
        q: "Can you take furniture apart for a narrow staircase?",
        a: "Yes, if it needs to come apart. Turn on Dismantling required at pickup and Reassembly required at delivery in the booking form, and add your beds, sofas and other large items to the Furniture inventory so the time is planned properly.",
      },
      {
        q: "How do I park a removal van in Wimbledon?",
        a: "It depends on your street. Where parking is controlled, Merton Council can arrange a suspension, so apply early and check its current lead times. Tell us when you book if the van is likely to park some distance from your door.",
      },
    ],
    postcode: 'SW19',
  },
  {
    slug: 'ilford',
    name: 'Ilford',
    title: 'Removals Ilford — Man & Van IG1 from £100 | London Express Removals',
    description: 'Removals in Ilford from £100. House moves, flat moves and man & van service across Ilford, Woodford, South Woodford and IG1. Same-day available, no hidden fees. Instant quote online.',
    hero: {
      eyebrow: 'Removals in Ilford',
      title: 'Removals Ilford — Fast Man & Van in IG1',
      subtitle: 'Trusted removal service across Ilford, Woodford, Wanstead and Barkingside. Instant pricing, no hidden fees, same-day moves available.',
    },
    about: "Ilford is the main town in the London Borough of Redbridge, a diverse and busy East London area with excellent Elizabeth line connections into central London. It offers a mix of Victorian terraces, 1930s semis, and new-build apartments. Our team covers all IG1-IG6 postcodes.",
    areas: ['Ilford', 'Woodford', 'South Woodford', 'Wanstead', 'Barkingside', 'Gants Hill', 'Seven Kings', 'Newbury Park'],
    faqs: [
      { q: 'Do you cover Woodford, Wanstead and Barkingside?', a: 'Yes — we cover all of Redbridge including Woodford, South Woodford, Wanstead, Barkingside, Gants Hill and all IG1-IG6 postcodes.' },
      { q: 'How much does a man and van cost in Ilford?', a: 'Prices start from £100 for a studio. A 2-bed house in Ilford typically costs from £160-£200. Use our instant calculator for an exact price.' },
      { q: 'Do you move from Ilford into central London?', a: 'Yes — with the Elizabeth line, Ilford has great connections and we regularly move residents between Ilford and all parts of London.' },
      { q: 'Do you offer same-day removals in Ilford?', a: 'Yes — same-day moves are available in many cases. Book before noon and we can often confirm a team for the same afternoon.' },
    ],
    postcode: 'IG1',
  },
  {
    slug: 'richmond',
    name: "Richmond",
    title: "Removals Richmond | Man & Van TW9 from £130",
    description: "Man and van removals in Richmond from £130 for the first two hours, then hourly. Flats and houses across TW9, TW10, TW1 and TW11. Get an instant quote.",
    hero: {
      eyebrow: "Removals in Richmond",
      title: "Removals in Richmond — Man & Van in TW9",
      subtitle: "Removals in Richmond, Kew, Twickenham and Teddington with a man and van team. Prices from £130 for the first two hours, then hourly, with same-day moves when we have space.",
    },
    about: "Richmond upon Thames is a South West London borough that follows the river. Postcodes include Richmond and Kew (TW9), Ham and Petersham (TW10), Twickenham (TW1, TW2), Teddington (TW11), Hampton (TW12), Barnes (SW13) and East Sheen (SW14). Tell us both addresses when you book, as we use them to work out distance and time.\n\nRichmond station has the District line, the Overground and South Western Railway, and Twickenham and Teddington are served by South Western Railway. River crossings at Richmond, Twickenham and Kew can back up at commuter times, so a moving time outside the rush hours often helps. On rugby match days, the roads around Twickenham Stadium are much busier.\n\nThe housing is a mix of Georgian and Victorian townhouses around Richmond Green and Richmond Hill, terraces in Twickenham and Teddington, 1930s family houses further out and riverside flats. Period houses often have steep stairs and narrow doorways, so a wardrobe or bed frame may need to come apart. If you need this, turn on Dismantling required and Reassembly required under Furniture services, and add your large items to the Furniture inventory.\n\nFor a studio or one-bedroom flat, 1 Man with the van may be enough. A family house in Richmond, Ham or Teddington usually calls for 2 Men or 3 Men and a longer booking. If you are unsure, pick Not Sure and we will advise.\n\nThe London Borough of Richmond upon Thames deals with parking suspensions, so ask for one ahead of your date and check its current lead times. Streets near the centre and the river can be tight, so tell us when you book if the van is likely to park some distance from your door.",
    areas: [
      "Richmond",
      "Kew",
      "Ham",
      "Twickenham",
      "Teddington",
      "Hampton",
      "Barnes",
      "East Sheen",
    ],
    faqs: [
      {
        q: "What does a man and van cost in Richmond?",
        a: "Prices start from £130, which covers the first two hours with one mover and a van, and extra time is charged by the hour. Period houses in Richmond often have stairs and tight parking, so mention both in the booking form. A bigger team costs more, and floors, lift access and the distance between your addresses count too. The online quote works out your price in about a minute, before you commit to anything.",
      },
      {
        q: "Which parts of Richmond do you cover?",
        a: "We cover Richmond upon Thames, including Richmond and Kew (TW9), Ham and Petersham (TW10), Twickenham (TW1, TW2), Teddington (TW11), Hampton (TW12), Barnes (SW13) and East Sheen (SW14). For addresses near the river or the borough edge, a quick call or message will settle it.",
      },
      {
        q: "Can you move me from a riverside flat or period townhouse?",
        a: "Yes. Riverside blocks often have a lift and set loading times, and period townhouses can have steep stairs. Check with your building manager, and tell us the floors and lift details in the booking form so the time is planned properly.",
      },
      {
        q: "Can you take furniture apart for a narrow staircase?",
        a: "Yes, if it needs to come apart. Turn on Dismantling required at pickup and Reassembly required at delivery in the booking form, and add your beds, sofas and other large items to the Furniture inventory so the time is planned properly.",
      },
      {
        q: "How do I park a removal van in Richmond?",
        a: "It depends on your street. Where parking is controlled, the London Borough of Richmond upon Thames can arrange a suspension, so apply early and check its current lead times. Tell us when you book if the van is likely to park some distance from your door.",
      },
    ],
    postcode: 'TW9',
  },
  {
    slug: 'peckham',
    name: 'Peckham',
    title: 'Removals Peckham — Man & Van SE15 from £100 | London Express Removals',
    description: 'Removals in Peckham from £100. House moves, flat moves and man & van service across Peckham, Bermondsey, Borough and SE15. Same-day available, no hidden fees. Instant quote online.',
    hero: {
      eyebrow: 'Removals in Peckham',
      title: 'Removals Peckham — Reliable Man & Van in SE15',
      subtitle: 'Trusted removal service across Peckham, Bermondsey, Borough and Dulwich. Instant pricing, no hidden fees, same-day moves available.',
    },
    about: "Southwark is one of central London's largest and most diverse boroughs, stretching from Borough Market and London Bridge to the creative hubs of Peckham and the leafy streets of Dulwich. Our team covers all SE1, SE5, SE15, SE16, SE17, and SE22 postcodes.",
    areas: ['Peckham', 'Bermondsey', 'Borough', 'Dulwich', 'East Dulwich', 'Camberwell', 'Elephant & Castle', 'Canada Water'],
    faqs: [
      { q: 'Do you cover Bermondsey, Borough and Dulwich?', a: 'Yes — we cover all of Southwark including Bermondsey, Borough, Dulwich, Camberwell, Elephant and Castle and all SE1, SE5, SE15, SE16, SE17, SE22 postcodes.' },
      { q: 'How much does a man and van cost in Peckham?', a: 'Prices start from £100 for a studio. A 2-bed flat in Peckham or Bermondsey typically costs from £160-£200. Use our instant calculator for an exact price.' },
      { q: 'Can you move from a warehouse conversion in Bermondsey?', a: 'Yes — warehouse and loft conversions are common in Bermondsey and we are experienced with freight lifts and large open-plan spaces.' },
      { q: 'Do you offer same-day removals in Peckham?', a: 'Yes — same-day moves are available in many cases. Book before noon and we can often confirm a team for the same afternoon.' },
    ],
    postcode: 'SE15',
  },
  {
    slug: 'sutton',
    name: 'Sutton',
    title: 'Removals Sutton — Man & Van SM1 from £100 | London Express Removals',
    description: 'Removals in Sutton from £100. House moves, flat moves and man & van service across Sutton, Cheam, Carshalton and SM1. Same-day available, no hidden fees. Instant quote online.',
    hero: {
      eyebrow: 'Removals in Sutton',
      title: 'Removals Sutton — Fast Man & Van in SM1',
      subtitle: 'Trusted removal service across Sutton, Cheam, Carshalton and Wallington. Instant pricing, no hidden fees, same-day moves available.',
    },
    about: "Sutton is a suburban South London borough with a mix of family homes, Victorian terraces, and modern flats close to excellent transport links. Our team covers all SM1-SM3 postcodes and regularly moves families across Sutton and neighbouring boroughs.",
    areas: ['Sutton Town', 'Cheam', 'Carshalton', 'Wallington', 'Belmont', 'Worcester Park', 'North Cheam', 'Benhilton'],
    faqs: [
      { q: 'Do you cover Cheam, Carshalton and Wallington?', a: 'Yes — we cover all of Sutton including Cheam, Carshalton, Wallington, Belmont, Worcester Park and all SM1, SM2, SM3, SM5, SM6 postcodes.' },
      { q: 'How much does a man and van cost in Sutton?', a: 'Prices start from £100 for a studio. A 2-bed house in Sutton typically costs from £160-£200. Use our instant calculator for an exact price.' },
      { q: 'Do you move from Sutton into central London?', a: 'Yes — we regularly move between Sutton and all parts of London. Use our instant calculator or request a custom quote.' },
      { q: 'Do you offer same-day removals in Sutton?', a: 'Yes — same-day moves are available in many cases. Book before noon and we can often confirm a team for the same afternoon.' },
    ],
    postcode: 'SM1',
  },
  {
    slug: 'canary-wharf',
    name: 'Canary Wharf',
    title: 'Removals Canary Wharf — Man & Van E14 from £100 | London Express Removals',
    description: 'Removals in Canary Wharf from £100. House moves, flat moves and man & van service across Canary Wharf, Isle of Dogs, Poplar and E14. Same-day available, no hidden fees. Instant quote online.',
    hero: {
      eyebrow: 'Removals in Canary Wharf',
      title: 'Removals Canary Wharf — Trusted Man & Van in E14',
      subtitle: 'Reliable removal service across Canary Wharf, Isle of Dogs, Poplar and Limehouse. Instant pricing, no hidden fees, same-day moves available.',
    },
    about: "Canary Wharf and the Isle of Dogs is one of London's most concentrated areas of high-rise residential living, with hundreds of apartment buildings ranging from older 1990s blocks to brand new luxury towers. Our team is highly experienced with service lift bookings, loading bay access, building management coordination, and the strict access requirements common in E14.",
    areas: ['Canary Wharf', 'Isle of Dogs', 'Poplar', 'Limehouse', 'Millwall', 'Cubitt Town', 'Mudchute', 'South Quay'],
    faqs: [
      { q: 'Do you cover Isle of Dogs, Poplar and Limehouse?', a: 'Yes — we cover all of Canary Wharf and surrounding Tower Hamlets areas including Isle of Dogs, Poplar, Limehouse and all E14 postcodes.' },
      { q: 'How do you handle loading bay access in Canary Wharf?', a: 'We contact the building management in advance to book the service lift and loading bay. We have extensive experience with the access requirements across Canary Wharf buildings.' },
      { q: 'How much does a man and van cost in Canary Wharf?', a: 'A 1-bed flat in Canary Wharf starts from around £140. A 2-bed flat typically costs from £200-£250. Use our instant calculator for an exact price.' },
      { q: 'Do you offer same-day removals in Canary Wharf?', a: 'Yes — same-day moves are available in many cases, though we recommend booking in advance for high-rise buildings to arrange loading bay access.' },
    ],
    postcode: 'E14',
  },
  {
    slug: 'walthamstow',
    name: "Walthamstow",
    title: "Removals Walthamstow | Man & Van E17 from £130",
    description: "Man and van removals in Walthamstow from £130 for the first two hours, then hourly. Flats and houses across E17, E10, E11 and E4. Get your instant quote.",
    hero: {
      eyebrow: "Removals in Walthamstow",
      title: "Removals in Walthamstow — Man & Van in E17",
      subtitle: "Removals in Walthamstow, Leyton, Leytonstone and Chingford with a man and van team. Prices from £130 for the first two hours, then hourly, with same-day moves when we have space.",
    },
    about: "Walthamstow is part of the London Borough of Waltham Forest, which also takes in Leyton (E10), Leytonstone (E11), Highams Park and Chingford (E4). The postcodes differ across the borough, so tell us both addresses when you book and we will use them to work out distance and time.\n\nWalthamstow Central is the end of the Victoria line and also has London Overground services. Leyton and Leytonstone are on the Central line, and Chingford, Highams Park and Wood Street are on the Overground. Blackhorse Road, which has both Victoria line and Overground services, is useful for the south-west of the borough. The A406 North Circular runs through the borough, so allow extra time at busy hours.\n\nSome residential streets in Waltham Forest have traffic filters or other limits on through traffic, particularly around Walthamstow Village. Check access to both addresses on the council's website before your moving date, and tell us in the booking notes if your street may be affected.\n\nMuch of the borough is Victorian and Edwardian terraced housing, and many houses have been converted into flats. Around Chingford and Highams Park there are also many 1930s semi-detached houses, and Walthamstow Village has older cottages. A flat conversion can mean steep stairs, so add your large items to the Furniture inventory and turn on Dismantling required and Reassembly required if something needs to come apart. List your beds, sofas and other large items so we can plan the team.\n\nWaltham Forest Council deals with parking suspensions, so ask for one ahead of your date and check its current lead times. A one-bedroom flat near Leyton Midland Road might need 1 Man, while a three-bedroom 1930s semi in Chingford is likely to need 2 Men or 3 Men for longer. If you cannot decide, pick Not Sure and we will advise.",
    areas: [
      "Walthamstow",
      "Walthamstow Village",
      "Leyton",
      "Leytonstone",
      "Chingford",
      "Highams Park",
      "Wood Street",
      "Higham Hill",
    ],
    faqs: [
      {
        q: "What does a man and van cost in Walthamstow?",
        a: "Pricing starts at £130 for the first two hours with one mover and a van, and extra time is charged by the hour. A flat near Walthamstow Central and a house in Chingford are very different jobs, so team size and the distance between your addresses affect the price, along with floors and lift access. Enter both addresses in the instant quote to see your price before you book.",
      },
      {
        q: "Which parts of Walthamstow and Waltham Forest do you cover?",
        a: "We cover Walthamstow and the rest of Waltham Forest, including Walthamstow (E17), Leyton (E10), Leytonstone (E11), and Chingford and Highams Park (E4). If you are unsure whether your address is included, call or message us.",
      },
      {
        q: "Do traffic restrictions in Waltham Forest affect a removal van?",
        a: "Some residential streets have traffic filters or other limits on through traffic. Check both addresses on Waltham Forest Council's website before your date, and tell us in the booking notes if you think your street is affected.",
      },
      {
        q: "Can I get a same-day removal in Walthamstow?",
        a: "In many cases, yes. Choose today's date in the booking form to see the earliest time left. If online booking for today has closed, pick another date or contact us directly.",
      },
      {
        q: "I am moving out of Walthamstow. Do you cover longer moves?",
        a: "Yes. Enter both addresses in the booking form and the quote reflects the distance. For moves outside the M25, request a custom quote.",
      },
    ],
    postcode: 'E17',
  },
  {
    slug: 'westminster',
    name: "Westminster",
    title: "Removals Westminster | Man & Van SW1 from £130",
    description: "Man and van removals in Westminster from £130 for the first two hours, then hourly. Flats and houses across SW1, W1, W2 and NW8. Get an instant quote.",
    hero: {
      eyebrow: "Removals in Westminster",
      title: "Removals in Westminster — Man & Van in SW1",
      subtitle: "Removals in Westminster, Pimlico, Marylebone, Paddington and Maida Vale with a man and van team. Prices from £130 for the first two hours, then hourly, with same-day moves when we have space.",
    },
    about: "The City of Westminster covers a lot of central London: Westminster, Victoria and Pimlico (SW1), Mayfair, Soho and Marylebone (W1), Paddington and Bayswater (W2), St John's Wood (NW8) and Maida Vale (W9). Tell us both addresses when you book, as we use them to work out distance and time.\n\nMuch of the borough is busy all day, and the streets around Victoria, Paddington and Oxford Street can be slow. Choosing a moving time outside the rush hours often helps, and it is worth telling us if your street has loading restrictions.\n\nHousing here is mostly flats: mansion blocks, converted Georgian and Victorian townhouses, purpose-built apartment buildings and the white stucco terraces of Pimlico, which were built by Thomas Cubitt. Many have a lift, a porter or a concierge, and some need the lift booked or have set hours for moves. Older conversions can have narrow stairs, so a wardrobe or bed frame may need to come apart.\n\nFor a studio or one-bedroom flat, 1 Man with the van may be enough. A larger flat or a family home in St John's Wood usually calls for 2 Men or 3 Men and a longer booking. If you are unsure, pick Not Sure and we will advise.\n\nWestminster City Council deals with parking suspensions, so ask for one ahead of your date and check its current lead times. Much of central Westminster is inside the Congestion Charge zone, but areas such as St John's Wood and Maida Vale are outside it. Check Transport for London's current rules for your date.",
    areas: [
      "Westminster",
      "Pimlico",
      "Victoria",
      "Marylebone",
      "Paddington",
      "Bayswater",
      "St John's Wood",
      "Maida Vale",
      "Mayfair",
      "Soho",
    ],
    faqs: [
      {
        q: "What does a man and van cost in Westminster?",
        a: "Prices start from £130, which covers the first two hours with one mover and a van, and extra time is charged by the hour. Moves in Westminster often involve lifts, loading restrictions and parking some way from the door, so mention these in the booking form. A bigger team costs more, and floors, lift access and the distance between your addresses count too. Put in both addresses and the instant quote will show your price before you confirm anything.",
      },
      {
        q: "Which parts of Westminster do you cover?",
        a: "We cover the City of Westminster, including Westminster, Victoria and Pimlico (SW1), Mayfair, Soho and Marylebone (W1), Paddington and Bayswater (W2), St John's Wood (NW8) and Maida Vale (W9). If your address is on the edge of the borough, call or message us and we will check it for you.",
      },
      {
        q: "Does the Congestion Charge apply to my move in Westminster?",
        a: "Much of central Westminster is inside the Congestion Charge zone, but areas such as St John's Wood and Maida Vale are outside it. Check Transport for London's current rules for your date, and tell us when you book if either address is in the zone.",
      },
      {
        q: "Can you move me from a building with a lift or concierge?",
        a: "Yes. Check with your building manager about lift booking, protection for the walls and floors, and the hours moves are allowed. Tell us the floor and lift details in the booking form so the time is planned properly.",
      },
      {
        q: "How do I park a removal van in Westminster?",
        a: "It depends on your street. Where parking is controlled, Westminster City Council can arrange a suspension, so apply early and check its current lead times. Tell us when you book if the van is likely to park some distance from your door.",
      },
    ],
    postcode: 'SW1',
  },
  {
    slug: 'uxbridge',
    name: 'Uxbridge',
    title: 'Removals Uxbridge — Man & Van UB8 from £100 | London Express Removals',
    description: 'Removals in Uxbridge from £100. House moves, flat moves and man & van service across Uxbridge, Hayes, Ruislip and UB8. Same-day available, no hidden fees. Instant quote online.',
    hero: {
      eyebrow: 'Removals in Uxbridge',
      title: 'Removals Uxbridge — Reliable Man & Van in UB8',
      subtitle: 'Trusted removal service across Uxbridge, Hayes, Ruislip and Northwood. Instant pricing, no hidden fees, same-day moves available.',
    },
    about: "Hillingdon is one of West London's largest boroughs, stretching from Uxbridge on the western edge of London to Hayes and Ruislip closer to the centre. It has excellent M40 and M4 motorway access, making it a popular base for long-distance moves. Our team covers all UB postcodes.",
    areas: ['Uxbridge', 'Hayes', 'Ruislip', 'Northwood', 'Yiewsley', 'West Drayton', 'Harefield', 'Ickenham'],
    faqs: [
      { q: 'Do you cover Hayes, Ruislip and Northwood?', a: 'Yes — we cover all of Hillingdon including Hayes, Ruislip, Northwood, West Drayton, Yiewsley and all UB3, UB4, UB5, UB8, UB10 postcodes.' },
      { q: 'Do you do long-distance moves from Uxbridge?', a: 'Yes — Uxbridge has great M40 access so we regularly do long-distance moves from UB postcodes to other parts of the UK. Request a custom quote.' },
      { q: 'How much does a man and van cost in Uxbridge?', a: 'Prices start from £100 for a studio. A 2-bed house in Uxbridge typically costs from £160-£200. Use our instant calculator for an exact price.' },
      { q: 'Do you offer same-day removals in Uxbridge?', a: 'Yes — same-day moves are available in many cases. Book before noon and we can often confirm a team for the same afternoon.' },
    ],
    postcode: 'UB8',
  },
];

export function getLocationBySlug(slug) {
  return locations.find((l) => l.slug === slug) || null;
}
