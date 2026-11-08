/* A Reading Map: Miss MacIntosh, My Darling at the center, five families of books around it. Draws wherever the page has an element with id rm-map. */
(function(){
function init(){
const svg=document.getElementById('rm-map');
if(!svg||svg.dataset.ready)return;svg.dataset.ready='1';
const NS='http://www.w3.org/2000/svg';
const SS='https://coralrussell.substack.com/p/';
const DREAM=['America, The Failed Utopia: The Dream That Goes All the Way Down',SS+'the-dream-that-goes-all-the-way-down'];
const SEVEN=['Seven Essential Books for America',SS+'seven-essential-books-for-america'];
const BUILT=['What Marguerite Young Built',SS+'what-marguerite-young-built'];
const LIN=['The Lineage','art-01-the-lineage'];
const INT=['Young’s Interviews Analyzed','youngs-interviews-analyzed'];
const NEV=['Susan Neville’s profile','interview-neville-profile'];
const ERA={s:['Same Conditions, Independent Discovery',SS+'same-conditions-independent-discovery'],f:['When the Formal Becomes Feminist',SS+'when-the-formal-becomes-feminist'],t:['The Split',SS+'the-split'],d:['The Delayed Arrival',SS+'the-delayed-arrival'],n:['The Inheritance, Named',SS+'the-inheritance-named']};

const FAM={
 Y:{name:'Her own work',color:'#B23A2C',blurb:'The books Marguerite Young wrote, from her first poems to the Debs biography finished after her death.'},
 S:{name:'What she read',color:'#9A6A1E',blurb:'Books Young herself named in interviews as the ones that formed her, in her own words where she gave them.'},
 C:{name:'Her circle',color:'#3E7D5E',blurb:'Students, champions, and writers who carried the novel with them.'},
 A:{name:'The American illusion and the con',color:'#2F5A8A',blurb:'The American books about the dream and the swindle that Miss MacIntosh, My Darling belongs beside.'},
 L:{name:'The lineage after her',color:'#7A3E6E',blurb:'Writers who arrived, by their own roads, at the discoveries Young made first.'}
};
const TH={
 p:['The plural self','I am more than one person.'],
 g:['Grief as permanent weather','The grief has not lifted.'],
 r:['Recursion as politics','It keeps happening again.'],
 i:['Illusion as primary reality','I can’t tell the dream from the real.'],
 u:['The refusal of resolution','I don’t need it tied up.'],
 c:['The con','I believed the story I was sold.']
};
const PICK={p:'whitman',g:'housekeeping',r:'beloved',i:'quixote',u:'shandy',c:'confid'};

/* [id, family, title, author, year shown, year for placement, threads, what it is, how it meets Young, links, connected ids] */
const B=[
['mmmd','Y','Miss MacIntosh, My Darling','Marguerite Young','1965',1965,'pigruc','Vera Cartwheel rides a bus across the Midwest looking for her lost nursemaid, and the life of every stranger on the road opens on the way: the opium lady in her house on the sea, the bus driver who may be dead, Esther Longtree forever pregnant, Miss MacIntosh herself under her red wig. Young expected two years and wrote for eighteen; the book runs 1,198 pages.','The center of the map. Every line on it runs back here.',[['Miss MacIntosh, My Darling','miss-macintosh-my-darling'],['All the Darlings','all-the-darlings']],['quixote','confid','angel','beloved']],
['prism','Y','Prismatic Ground','Marguerite Young','1937',1937,'ig','Her first book, poems published by Macmillan while she was teaching high school English in Indianapolis.','The ground the novel would later build on: the real world seen through a prism, never plainly.',[['The Collected Poems','the-collected-poems-of-marguerite-young'],['Exploring Young’s Poetry','poetry-home']],['fable']],
['fable','Y','Moderate Fable','Marguerite Young','1944',1944,'ip','Her second book of poems, published the year before Angel in the Forest.','The poems test, in small, the ideas the novel would hold at full size.',[['The Collected Poems','the-collected-poems-of-marguerite-young'],['The Same Ideas Across the Four Books','poetry-04-01-the-same-ideas-across-the-four-books']],['prism','angel']],
['angel','Y','Angel in the Forest: A Fairy Tale of Two Utopias','Marguerite Young','1945',1945,'ircg','The history of New Harmony, Indiana, where Father Rapp’s Harmonists and then Robert Owen’s socialists each tried to build a perfect society on the same ground.','Two American utopias and the dream beneath them. The novel’s questions about illusion start here, in history.',[['Angel in the Forest','angel-in-the-forest'],['A Reading in Fourteen Chapters','angel-home']],['blithe','looking','spoon','mmmd']],
['muses','Y','Inviting the Muses: Stories, Essays, Reviews','Marguerite Young','1994',1994,'p','Stories, fifteen essays including “On Teaching,” twenty-three book reviews, and sketches of Johnny Gruelle and Marianne Moore.','Young on her own craft and on the books she read as a working critic.',[['Inviting the Muses','inviting-the-muses'],['A Reading, Part by Part','muses-home']],['darling']],
['harp','Y','Harp Song for a Radical: The Life and Times of Eugene Victor Debs','Marguerite Young','1999',1999,'rc','The life of the labor leader and five-time candidate for president, set inside the whole radical history of the nineteenth century. Charles Ruas edited it after her death.','The other half of the American dream: the people who organized against the ones selling it.',[['Harp Song for a Radical','harp-song-for-a-radical'],['A History Companion','harp-companion-home']],['jungle','angel','looking']],
['poems','Y','The Collected Poems of Marguerite Young','Marguerite Young','2022',2022,'ig','Every poem of hers that survives: Prismatic Ground in full, Moderate Fable, early verse, and later poems, edited by Phil Bevis and Joshua Rothes.','The whole poetic record in one place for the first time.',[['The Collected Poems','the-collected-poems-of-marguerite-young']],['prism','fable']],

['james','S','The Principles of Psychology','William James','1890',1890,'pi','The founding American psychology, which named the stream of consciousness and described the many selves a person carries.','The influence Young named most often. She studied it “as if it were a Bible” and took from it the many selves under one roof, false memory, and “the person you did not become.”',[['William James and Pragmatism','william-james-and-pragmatism'],['On James’s stream (Ch 39)','on-william-james-and-the-stream-of-consciousness-ch-39'],INT],['whitman','aug']],
['aug','S','The Confessions and The City of God','Augustine of Hippo','397 to 426',400,'pg','A soul’s account of itself before God, and a history of the two cities, the earthly and the heavenly.','She named both again and again, for their imagery and for Augustine’s obsession with dreams. Asked about Joyce, she answered with Augustine.',[['Augustine and Christian Theology','augustine-and-christian-theology'],['On Augustine alongside James (Ch 39)','on-st-augustine-alongside-william-james-ch-39'],INT],['james','bible']],
['quixote','S','Don Quixote','Miguel de Cervantes','1605 and 1615',1610,'iuc','An old man who has read too many romances rides out to live one, and the world plays along, mocks him, and finally talks him out of it.','She called it “the greatest of all novels” and named it on the first page of her own as a key to the journey ahead.',[['Don Quixote','intertext-s6-don-quixote'],['On Don Quixote (Ch 1)','on-don-quixote-ch-1'],INT],['mmmd','shandy','gatsby']],
['shandy','S','The Life and Opinions of Tristram Shandy, Gentleman','Laurence Sterne','1759 to 1767',1763,'up','A memoir that digresses so freely its narrator is barely born by the third volume.','She said it directly influenced her and pointed to Sterne when explaining her long sentences.',[INT],['quixote','tomjones']],
['dead','S','Dead Souls','Nikolai Gogol','1842',1842,'ciu','Chichikov rides across Russia buying the names of dead serfs so he can mortgage them as if they were alive.','She was “deeply under the spell” of it, for its full minor characters and its form as a novel of the road. It is also a con, which puts it beside Melville.',[INT],['confid','mmmd']],
['dickens','S','The novels of Charles Dickens','Charles Dickens','1836 to 1870',1853,'p','Novels crowded with minor characters, each one fully alive and shown through body and clothing.','Her grandmother gave her Dickens at ten or eleven. From him she took the rule that no character is minor, and she learned shorthand because he had.',[INT],['dead','sartor']],
['moby','S','Moby-Dick','Herman Melville','1851',1851,'gi','Ishmael ships on the Pequod under Ahab, who means to kill the white whale that took his leg.','Her favorite American novel. Melville was “my great love,” and she saw in it the pull between Scottish Calvinism and the longing for Catholicism she found in her own work.',[INT,['Be Bak in a Whale','whale-home']],['confid','rime']],
['browning','S','The Ring and the Book','Robert Browning','1868 to 1869',1868,'p','One Roman murder case told again and again by the people who lived it, each telling different.','She studied all of Browning at eighteen with Catharine Merrill. Her belief that characters should rest on real events came from Browning’s poet as reporter.',[INT],['james','spoon']],
['sartor','S','Sartor Resartus','Thomas Carlyle','1833 to 1834',1834,'ip','A mock biography of a German professor and his philosophy of clothes.','She took Carlyle as her master when she moved from poetry to prose. Body, soul, and clothing run through every character in the novel.',[INT],['dickens','james']],
['rime','S','The Rime of the Ancient Mariner','Samuel Taylor Coleridge','1798',1798,'gr','A sailor kills an albatross and must tell the story again and again for the rest of his life.','She called its albatross and guilt “the secret heart” of her novel. Coleridge’s debate with Robert Owen also drew her to Angel in the Forest.',[['Romantic Poets','romantic-poets'],INT],['opium','angel','moby']],
['opium','S','Confessions of an English Opium-Eater','Thomas De Quincey','1821',1821,'ig','The pleasures and then the pains of opium, told by the man who took it.','She had read it before she met the real opium lady, and it shaped how she understood her. Catherine Cartwheel lives inside this book’s dreams.',[['Opium','opium'],['The History of Opium','the-history-of-opium'],INT],['rime','yellow']],
['bible','S','The King James Bible','','1611',1611,'rg','The English translation whose cadences run under four centuries of English prose.','Her grandmother had her read it for its literary style as training for a writer, and Young still called it the best training there is.',[['The Bible','the-bible'],INT],['aug','milton']],
['plutarch','S','Parallel Lives','Plutarch','about 100',100,'p','Paired lives of famous Greeks and Romans, read for character more than history.','She called it “one of the most important books” for her.',[INT],['dickens']],
['milton','S','Paradise Lost','John Milton','1667',1667,'gi','The fall of the angels and of Adam and Eve, told by a blind poet.','Her major subject at the University of Chicago. Milton’s blindness is one reason the novel is full of people missing a sense.',[['Paradise Lost','intertext-s6-paradise-lost'],['Milton','milton'],INT],['dante','bible']],
['dante','S','The Divine Comedy','Dante Alighieri','about 1308 to 1321',1314,'gr','A pilgrim walks down through Hell and up through Purgatory to Paradise.','At Chicago she studied the epic sources, Dante among them, and the novel’s descents keep his map.',[['Dante and The Divine Comedy','intertext-s6-dante-and-the-divine-comedy'],INT],['milton']],
['emerson','S','Essays','Ralph Waldo Emerson','1841',1841,'i','Self-reliance, the Over-Soul, and the American idea that the self can make its own world.','She set the opium lady’s house near Boston because it was the home of “my beloved Emerson.”',[['On Emerson’s immortal beauty (Ch 41)','on-emersons-immortal-beauty-ch-41'],INT],['whitman','blithe']],
['whitman','S','Leaves of Grass','Walt Whitman','1855',1855,'p','One voice that holds a whole nation: “I am large, I contain multitudes” (“Song of Myself,” 51).','She described her novel as “a sad Walt Whitman,” built on his theme of the one and the many.',[INT],['james','emerson']],
['crusoe','S','Robinson Crusoe','Daniel Defoe','1719',1719,'i','A castaway builds a whole life, and a whole Calvinist account book, on an island.','She thought of Miss MacIntosh as a kind of Robinson Crusoe with her umbrella, a Calvinist figure set down in paradise.',[INT],['milton']],
['spoon','S','Spoon River Anthology','Edgar Lee Masters','1915',1915,'gp','The dead of a small Illinois town speak their own epitaphs, and the town’s secrets come out.','She thought about it a great deal while writing Angel in the Forest, together with Gray’s “Elegy Written in a Country Churchyard.”',[INT],['angel','winesburg']],
['tomjones','S','Tom Jones','Henry Fielding','1749',1749,'u','A foundling’s comic road through eighteenth-century England.','In Ronald Crane’s class at Chicago she read it thirteen times to study its structure, the training she valued most.',[INT],['shandy']],
['beagle','S','The Voyage of the Beagle','Charles Darwin','1839',1839,'r','Darwin’s journal of five years at sea, the notes that led to evolution.','Minna Weissenbach, the real opium lady, urged her to read it, and Young kept notebooks of her nature reading.',[INT],['opium']],

['nin','C','The Novel of the Future','Anaïs Nin','1968',1968,'i','Nin’s book on the poetic novel and the writers making it.','Nin wrote about Young here, called the novel the greatest modern novel, and wrote the preface to the 1979 edition. Years before, as fiction editor of the Tiger’s Eye, Young was “one of the first publishers of a chapter of Anais Nin’s novels.”',[['The Ruas interview','interview-ruas-career'],NEV],['mmmd']],
['vonnegut','C','Slaughterhouse-Five','Kurt Vonnegut','1969',1969,'rgu','Billy Pilgrim comes “unstuck in time” and lives the firebombing of Dresden over and over.','Vonnegut was her student when she taught high school English in Indianapolis. His verdict, “unquestionably a genius,” ran on the novel’s cover.',[['The Marguerite Young Society','index']],['mmmd']],
['capote','C','Other Voices, Other Rooms','Truman Capote','1948',1948,'ig','A boy goes looking for a father he has never seen and finds a house of dreams and ghosts in the Southern swamps.','Capote said of Young, “she was the one who taught us all.”',[NEV],['oconnor']],
['oconnor','C','Wise Blood','Flannery O’Connor','1952',1952,'ic','Hazel Motes preaches the Church Without Christ while a street of false prophets sells salvation around him.','Young taught Paul Griffith, who taught O’Connor, who called Young her “dearest grand mere.” Young named O’Connor among the later writers she admired.',[NEV,INT],['capote','confid']],
['gardner','C','Grendel','John Gardner','1971',1971,'p','Beowulf’s monster tells his own side of the story.','Gardner studied with Young at the Iowa Writers’ Workshop, where she taught from 1954 to 1957.',[['The Marguerite Young Society','index'],['The Guru, on her Iowa years','interview-dowling-guru']],['mmmd']],
['tyler','C','The Accidental Tourist','Anne Tyler','1985',1985,'g','A man who writes travel guides for people who hate to travel tries to live after his son’s death.','Tyler read Miss MacIntosh to recover her nerve while writing this novel and gave her hero a copy of it as a companion.',[NEV],['darling']],
['darling','C','Marguerite Young, Our Darling: Tributes and Essays','edited by Miriam Fuchs','1994',1994,'p','Essays on Young’s work, tributes from Amy Clampitt, Anne Tyler, and Stanley Kunitz, and two interviews.','The festschrift that gathered her readers in one place.',[['Marguerite Young, Our Darling','marguerite-young-our-darling']],['tyler','muses']],

['blithe','A','The Blithedale Romance','Nathaniel Hawthorne','1852',1852,'icr','A poet joins a utopian farm modeled on Brook Farm and watches the reformers’ egos and secrets undo it.','One corner of the series’ core triangle with Gatsby and Young: three books at three turning points, “diagnosing the same disease from a different angle.”',[DREAM],['gatsby','angel','emerson']],
['gatsby','A','The Great Gatsby','F. Scott Fitzgerald','1925',1925,'ic','Jay Gatsby invents himself out of money and longing and throws parties for a green light across the bay.','The second corner of the triangle. Gatsby and Miss MacIntosh are both built on a dream that cannot survive being reached.',[DREAM],['blithe','quixote','mmmd']],
['confid','A','The Confidence-Man: His Masquerade','Herman Melville','1857',1857,'cip','On April Fools’ Day a shape-shifting swindler works the passengers of the Mississippi steamboat Fidele, one disguise at a time.','The book at the root of the con series. The Fidele and the house on the hill are the same vessel.',[DREAM,SEVEN],['dead','moby','mmmd','bigcon']],
['yankee','A','A Connecticut Yankee in King Arthur’s Court','Mark Twain','1889',1889,'ri','A Hartford factory boss lands in Camelot, sells it progress, and ends in a massacre.','Young loved Twain for his dark cosmic spirit.',[DREAM,INT],['quixote','looking']],
['yellow','A','The Yellow Wall-Paper','Charlotte Perkins Gilman','1892',1892,'pi','A woman confined to a room by her physician husband watches a woman form behind the wallpaper.','A woman shut in a room by other people’s idea of her health, as Catherine Cartwheel is shut in her dreams.',[DREAM],['opium','herland']],
['herland','A','Herland','Charlotte Perkins Gilman','1915',1915,'i','Three men stumble into a country of women that has run itself well for two thousand years.','A utopia that works, written against the ones that did not.',[DREAM],['yellow','looking','angel']],
['adams','A','The Education of Henry Adams','Henry Adams','1907 and 1918',1912,'r','The grandson and great-grandson of presidents finds that nothing he was taught prepared him for the dynamo age.','History as something that repeats and accelerates past the people inside it.',[DREAM],['yankee']],
['looking','A','Looking Backward: 2000 to 1887','Edward Bellamy','1888',1888,'ir','A Bostonian sleeps until the year 2000 and wakes in a planned, peaceful socialist America.','A bestseller that set up clubs across the country, one more American utopia in the line of New Harmony.',[DREAM],['angel','harp','herland']],
['jungle','A','The Jungle','Upton Sinclair','1906',1906,'rc','A Lithuanian family comes to Chicago’s stockyards believing in America and is ground down by it.','The dream sold to immigrants, and the labor history Young wrote in Harp Song for a Radical.',[DREAM],['harp','street']],
['carrie','A','Sister Carrie','Theodore Dreiser','1900',1900,'ic','A country girl rises in Chicago and New York while the man who ruined himself for her sinks.','Young named Dreiser among the great dreamers from the Midwest.',[DREAM,INT],['mainst','gatsby']],
['mainst','A','Main Street','Sinclair Lewis','1920',1920,'i','Carol Kennicott tries to reform a Minnesota prairie town that does not want reforming.','Lewis told Young she had shown “another America.”',[DREAM,INT],['babbitt','carrie','winesburg']],
['babbitt','A','Babbitt','Sinclair Lewis','1922',1922,'ci','A real estate booster in a Midwest city lives by slogans until they stop holding him up.','The salesman’s faith, from inside.',[DREAM],['mainst','salesman']],
['cant','A','It Can’t Happen Here','Sinclair Lewis','1935',1935,'cr','A folksy demagogue wins the presidency and turns the country into a dictatorship.','The con at the scale of a nation.',[DREAM],['longest']],
['winesburg','A','Winesburg, Ohio','Sherwood Anderson','1919',1919,'gp','Linked stories of the lonely, thwarted people of one small Ohio town.','Kin to Spoon River. Young had not yet read Anderson when she wrote Angel in the Forest.',[DREAM,INT],['spoon','mainst','lonely']],
['mirth','A','The House of Mirth','Edith Wharton','1905',1905,'ic','Lily Bart is raised to marry money and cannot make herself complete the sale.','The marriage market as an American con played on women.',[DREAM],['gatsby']],
['usa','A','U.S.A.','John Dos Passos','1930 to 1936',1933,'r','Three novels that cut lives together with newsreels, headlines, and biographies of the powerful.','A whole country told as collage, many voices at once.',[DREAM],['jungle']],
['babb','A','Whose Names Are Unknown','Sanora Babb','1939, published 2004',1939,'gr','Dust Bowl farm families from the Oklahoma panhandle to the California camps, written from inside them.','Babb’s publisher shelved it when The Grapes of Wrath came out, and it waited sixty-five years. A woman’s book buried by a man’s.',[DREAM],['lonely']],
['lonely','A','The Heart Is a Lonely Hunter','Carson McCullers','1940',1940,'gp','In a Georgia mill town everyone confides in John Singer, a deaf man who understands less than they think.','The confidant who cannot hear, like the stone-deaf man and the many silent listeners in Young’s novel.',[DREAM,['Silence and Deafness','silence-and-deafness']],['winesburg','mmmd']],
['salesman','A','Death of a Salesman','Arthur Miller','1949',1949,'ic','Willy Loman has sold himself the dream so long he cannot see it failing.','The con turned inward: the man who believes his own pitch.',[DREAM],['babbitt','gatsby']],
['douglass','A','Narrative of the Life of Frederick Douglass','Frederick Douglass','1845',1845,'rc','Douglass tells how he was enslaved, how he learned to read, and how he got free. In 1852 he asked, “What to the Slave is the Fourth of July?”','The founding con named by the people it was run on.',[DREAM],['jacobs','wells']],
['jacobs','A','Incidents in the Life of a Slave Girl','Harriet Jacobs','1861',1861,'g','Jacobs hid for seven years in a crawl space too low to stand in, watching her children through a hole in the wall.','Grief and endurance with no end the book can promise.',[DREAM],['douglass','beloved']],
['wells','A','Southern Horrors: Lynch Law in All Its Phases','Ida B. Wells','1892',1892,'r','Wells documented lynching case by case and showed the lie used to excuse it.','The violence underneath the American story, counted.',[DREAM,['Lynching and Racial Violence','lynching-and-racial-violence']],['douglass','dubois']],
['dubois','A','The Souls of Black Folk','W. E. B. Du Bois','1903',1903,'p','Essays on the color line and the double consciousness of looking at oneself through others’ eyes.','A self made plural by force, which is one of the novel’s questions in another key.',[DREAM],['invisible','dunbar']],
['dunbar','A','“We Wear the Mask”','Paul Laurence Dunbar','1895',1895,'p','A short poem on the smile worn over the grief.','The mask and the face under it.',[DREAM],['dubois']],
['cane','A','Cane','Jean Toomer','1923',1923,'pu','Prose sketches, poems, and a play about Black life in rural Georgia and in Washington, D.C.','A book that will not settle into one form.',[DREAM],['winesburg','hurston']],
['hurston','A','Their Eyes Were Watching God','Zora Neale Hurston','1937',1937,'p','Janie Crawford tells her friend the story of three marriages and the self she came to through them.','A woman telling her own life in her own voice.',[DREAM],['cane']],
['native','A','Native Son','Richard Wright','1940',1940,'r','Bigger Thomas, trapped on Chicago’s South Side, kills and runs, and the city convicts him for more than his crime.','The system that makes the outcome it then punishes.',[DREAM],['invisible','street']],
['street','A','The Street','Ann Petry','1946',1946,'ic','Lutie Johnson believes Benjamin Franklin’s promise of thrift and hard work on 116th Street in Harlem.','The bootstrap dream sold to a Black single mother, and what it costs her.',[DREAM,['Benjamin Franklin and Poor Richard’s Almanack','intertext-s6-benjamin-franklin-and-poor-richards-almanack']],['native','raisin']],
['invisible','A','Invisible Man','Ralph Ellison','1952',1952,'pci','An unnamed narrator moves through a series of American promises, each one a con, until he goes underground.','A picaresque of the road, like Vera’s, through illusions that call themselves institutions.',[DREAM],['dubois','confid','native']],
['hughes','A','Montage of a Dream Deferred','Langston Hughes','1951',1951,'ir','A book-length poem of Harlem in the rhythms of bebop, asking what happens to a dream deferred.','The American dream from the side it was kept from.',[DREAM],['raisin']],
['raisin','A','A Raisin in the Sun','Lorraine Hansberry','1959',1959,'ir','The Younger family’s life insurance check could buy a house in a white neighborhood that does not want them.','Its title comes from Hughes’s dream deferred.',[DREAM],['hughes','street']],
['fire','A','The Fire Next Time','James Baldwin','1963',1963,'r','Two letters on race, religion, and the country’s refusal to know its own history.','Baldwin on the American innocence that is itself the crime.',[DREAM],['douglass']],
['blackhawk','A','Life of Black Hawk','Black Hawk','1833',1833,'rg','The Sauk leader’s account, dictated after the war that drove his people from Illinois.','The Midwest the novel’s bus crosses was taken this way.',[DREAM,['Iowa, Indiana, and the Midwest','iowa-indiana-and-the-midwest']],['zitkala','surrounded']],
['zitkala','A','American Indian Stories','Zitkala-Ša','1921',1921,'pg','A Yankton Dakota woman on her childhood, the boarding school that cut her hair, and the self it tried to erase.','A self split by force between two worlds.',[DREAM],['blackhawk']],
['mathews','A','Sundown','John Joseph Mathews','1934',1934,'ci','A young Osage man grows up through the oil boom that made his nation rich and set swindlers on it.','The con run on the Osage, from inside.',[DREAM],['surrounded','squatter']],
['surrounded','A','The Surrounded','D’Arcy McNickle','1936',1936,'r','Archilde returns to the Flathead reservation in Montana and cannot get out of the history waiting there.','History that closes in again and again.',[DREAM],['mathews']],
['squatter','A','The Squatter and the Don','María Amparo Ruiz de Burton','1885',1885,'cr','A Californio family loses its land to squatters, railroad monopolies, and the law written for them.','The land con told by its targets, by the first Mexican American woman to publish novels in English.',[DREAM],['mathews']],
['pocho','A','Pocho','José Antonio Villarreal','1959',1959,'p','Richard Rubio grows up in Santa Clara between his family’s Mexico and the America of his schools.','A self made out of two countries.',[DREAM],['nono']],
['sui','A','Mrs. Spring Fragrance','Sui Sin Far','1912',1912,'p','Stories of Chinese Americans in Seattle and San Francisco by a writer of Chinese and English parents.','Selves made between nations.',[DREAM],['bulosan']],
['bulosan','A','America Is in the Heart','Carlos Bulosan','1946',1946,'ig','A Filipino migrant works the fields and canneries of the West Coast and still believes in the America that beats him.','The dream held on to by the people it fails.',[DREAM],['nono','jungle']],
['nono','A','No-No Boy','John Okada','1957',1957,'pg','Ichiro comes home to Seattle after prison for refusing the draft from an internment camp.','Grief and a split self after the country turned on its own people.',[DREAM],['bulosan','pocho']],
['bigcon','A','The Big Con: The Story of the Confidence Man','David W. Maurer','1940',1940,'c','A linguist’s study of the professional grifters of the 1920s and their language, from the wire to the rag.','The con as a craft with its own speech. The book behind The Sting.',[SEVEN],['confid','konnikova']],
['ponzi','A','Ponzi’s Scheme: The True Story of a Financial Legend','Mitchell Zuckoff','2005',2005,'c','How Charles Ponzi took Boston for millions in 1920 with postal reply coupons.','A Boston con, in the city where the novel’s opium lady dreams.',[SEVEN],['bigcon','spec']],
['charlatan','A','Charlatan: America’s Most Dangerous Huckster, the Man Who Pursued Him, and the Age of Flimflam','Pope Brock','2008',2008,'c','John R. Brinkley sold goat-gland transplants and built a radio empire on them.','The medicine show as American institution.',[SEVEN],['bigcon']],
['spec','A','Speculation Nation: Land Mania in the Revolutionary American Republic','Michael A. Blaakman','2023',2023,'cr','The founding generation’s frenzy of land speculation, and the dispossession it ran on.','The con at the very start of the country.',[SEVEN],['squatter','blackhawk']],
['konnikova','A','The Confidence Game: Why We Fall for It … Every Time','Maria Konnikova','2016',2016,'ci','A psychologist on why the con works on the mind, and why the marks come back.','The illusion we help build, explained.',[SEVEN],['bigcon','james']],
['longest','A','The Longest Con: How Grifters, Swindlers, and Frauds Hijacked American Conservatism','Joe Conason','2024',2024,'cr','A history of the swindles run through a political movement, from mail-order fear to the present.','The con as politics, repeated.',[SEVEN],['cant']],

['berg','L','Berg','Ann Quin','1964',1964,'pu','A man comes to a seaside town to kill his father, and interior and exterior stop being separate in the prose.','Working in Britain at almost the same moment as Young, with the same formal instinct and almost no shared audience.',[LIN],['gh']],
['gh','L','The Passion According to G.H.','Clarice Lispector','1964',1964,'pi','A woman’s encounter with a cockroach in a maid’s room becomes a dissolution of the self.','Brazil, the same decade, the same place reached from a different start.',[LIN],['berg']],
['slouching','L','Slouching Towards Bethlehem','Joan Didion','1968',1968,'ir','Essays on California and the 1960s, the center not holding.','The same conditions, an independent discovery: the dream examined from inside.',[ERA.s,BUILT],['magical','gatsby']],
['gravity','L','Gravity’s Rainbow','Thomas Pynchon','1973',1973,'riu','A V-2 rocket, a paranoid war, and a system that makes and remakes itself around everyone in it.','Recursion as politics, arrived at on its own.',[ERA.s,BUILT],['infinite']],
['speedboat','L','Speedboat','Renata Adler','1976',1976,'up','A journalist’s life in fragments that arrive and do not connect in conventional ways.','Young’s refusal to resolve, made structural.',[LIN],['dept']],
['acker','L','Blood and Guts in High School','Kathy Acker','1978',1978,'piu','A girl’s story torn, plagiarized, drawn, and dreamed. Great Expectations (1982) and Empire of the Senseless (1988) continue it.','When the formal becomes feminist. Acker shared an issue of the Review of Contemporary Fiction with Young.',[ERA.f,BUILT,['Steven Moore’s memoir','interview-moore-dalkey']],['twogirls']],
['housekeeping','L','Housekeeping','Marilynne Robinson','1980',1980,'gu','Ruth and her sister are raised by their drifting aunt in a lake town where the dead are never far.','The long sentence at its quietest, and a narrator who stays in the room with loss.',[ERA.f,LIN,BUILT],['beloved','dept']],
['lovemed','L','Love Medicine','Louise Erdrich','1984',1984,'pg','Linked stories of Ojibwe families in North Dakota told by many voices over fifty years.','The plural self as a whole community.',[ERA.f,BUILT],['beloved','zitkala']],
['beloved','L','Beloved','Toni Morrison','1987',1987,'grp','Sethe, who escaped slavery, lives with the ghost of the daughter she killed to keep from it.','The past that does not recede and the self made plural to survive. Young named Morrison among the later writers she admired.',[ERA.s,LIN,BUILT],['jacobs','housekeeping','mmmd']],
['borderlands','L','Borderlands/La Frontera: The New Mestiza','Gloria Anzaldúa','1987',1987,'p','Poetry and prose in English and Spanish on living on the border, in the body and on the map.','The self that lives in more than one place at once.',[ERA.t,BUILT],['sofar']],
['twogirls','L','Two Girls, Fat and Thin','Mary Gaitskill','1991',1991,'pg','Two women with wounded childhoods meet over a cult writer and find their selves in each other.','Also Bad Behavior (1988) and Because They Wanted To (1997).',[ERA.t,BUILT],['acker']],
['sofar','L','So Far from God','Ana Castillo','1993',1993,'ig','A New Mexico mother and four daughters, one of whom rises from her own funeral.','Miracle and the everyday held as one reality.',[ERA.t,BUILT],['borderlands']],
['rings','L','The Rings of Saturn','W. G. Sebald','1995',1995,'rg','A walk along the Suffolk coast opens into the histories of empire and ruin. Austerlitz (2001) follows.','Time as sediment, worked more explicitly than anywhere else.',[LIN],['lostchildren']],
['infinite','L','Infinite Jest','David Foster Wallace','1996',1996,'ru','A tennis academy, a halfway house, and a film so entertaining it kills.','The split, at maximum length, refusing to end.',[ERA.t,BUILT],['gravity']],
['magical','L','The Year of Magical Thinking','Joan Didion','2005',2005,'g','The year after her husband died at the dinner table, while their daughter lay in a coma.','Grief as permanent weather, told plainly.',[ERA.s,BUILT],['slouching','dept']],
['dept','L','Dept. of Speculation','Jenny Offill','2014',2014,'gu','A marriage near its end told in fragments. Weather (2020) follows.','The incompletion built into the sentence itself.',[ERA.d,LIN,BUILT],['speedboat','argonauts']],
['argonauts','L','The Argonauts','Maggie Nelson','2015',2015,'pu','Love, a pregnancy, and a partner’s transition, with theory in the same room as the body.','A self that will not hold one name.',[ERA.d,BUILT],['dept','dreamhouse']],
['heavy','L','Heavy: An American Memoir','Kiese Laymon','2018',2018,'gp','A letter to his mother about the body, the lies, and the debts of growing up Black in Mississippi.','The inheritance, named.',[ERA.n,BUILT],['vuong']],
['lostchildren','L','Lost Children Archive','Valeria Luiselli','2019',2019,'rg','A family drives across America toward the border while children are detained there. Tell Me How It Ends (2017) is its nonfiction twin.','A road novel across the same country as Vera’s bus.',[ERA.d,BUILT],['rings','mmmd']],
['dreamhouse','L','In the Dream House','Carmen Maria Machado','2019',2019,'pi','A memoir of an abusive relationship told in short chapters, each through a different genre.','The house of illusion, from the inside.',[ERA.n,BUILT],['argonauts']],
['vuong','L','On Earth We’re Briefly Gorgeous','Ocean Vuong','2019',2019,'gr','A son writes a letter to his mother, who cannot read it.','The crossing point between generations.',[ERA.n,LIN,BUILT],['heavy','beloved']]
];
const by={};B.forEach(b=>by[b[0]]={id:b[0],fam:b[1],title:b[2],author:b[3],year:b[4],y:b[5],th:b[6].split(''),about:b[7],young:b[8],links:b[9],x:b[10]});
const ids=B.map(b=>b[0]);
/* connections run both ways */
ids.forEach(id=>by[id].x.forEach(o=>{if(!by[o])console.warn('rm: missing',o);else if(!by[o].x.includes(id))by[o].x.push(id)}));

/* layout: families are wedges; distance from the center is distance in time from 1965 */
const CX=400,CY=400,R0=74,R1=350,MAXD=1600;
const rad=y=>{const d=Math.min(Math.abs(y-1965),MAXD);return R0+(R1-R0)*Math.log(1+d)/Math.log(1+MAXD)};
const order=['A','L','S','Y','C'];
const count={};order.forEach(f=>count[f]=ids.filter(i=>by[i].fam===f&&i!=='mmmd').length);
const wt=f=>Math.max(count[f],10);
const tot=order.reduce((s,f)=>s+wt(f),0);
let a0=Math.PI/2-Math.PI*wt('A')/tot;
const wedge={};
order.forEach(f=>{const span=2*Math.PI*wt(f)/tot;wedge[f]=[a0,a0+span];a0+=span});
order.forEach(f=>{
  const list=ids.filter(i=>by[i].fam===f&&i!=='mmmd').sort((a,b)=>by[a].y-by[b].y);
  const [s,e]=wedge[f],pad=0.06;
  list.forEach((id,k)=>{const t=list.length===1?.5:k/(list.length-1);const a=s+pad+(e-s-2*pad)*t;const r=rad(by[id].y);by[id].a=a;by[id].px=CX+r*Math.cos(a);by[id].py=CY+r*Math.sin(a)});
});
by.mmmd.px=CX;by.mmmd.py=CY;

const el=(n,at,p)=>{const e=document.createElementNS(NS,n);for(const k in at)e.setAttribute(k,at[k]);if(p)p.appendChild(e);return e};
const gBack=el('g',{},svg),gLines=el('g',{'class':'lines'},svg),gDots=el('g',{},svg),gLab=el('g',{'class':'labs'},svg);
order.forEach(f=>{const[s,e]=wedge[f];
  const p=(r,a)=>[CX+r*Math.cos(a),CY+r*Math.sin(a)];const[x1,y1]=p(R1+30,s),[x2,y2]=p(R1+30,e);
  el('path',{d:`M${CX},${CY} L${x1},${y1} A${R1+30},${R1+30} 0 ${e-s>Math.PI?1:0} 1 ${x2},${y2} Z`,fill:FAM[f].color,'fill-opacity':'.07',stroke:'#B4A88C','stroke-width':'.8'},gBack);
  const m=(s+e)/2,[lx,ly]=p(R1+16,m);const t=el('text',{x:lx,y:ly,'class':'fam-lab','text-anchor':Math.cos(m)>.3?'end':Math.cos(m)<-.3?'start':'middle','dominant-baseline':'middle',fill:FAM[f].color},gBack);t.textContent=FAM[f].name;
});
[[10,'10 years'],[50,'50'],[100,'100'],[300,'300'],[1000,'1,000 years from 1965']].forEach(([d,l])=>{const r=rad(1965+d);el('circle',{cx:CX,cy:CY,r,fill:'none',stroke:'#B4A88C','stroke-dasharray':'2 4','stroke-width':'.8'},gBack);const t=el('text',{x:CX+4,y:CY-r-3,'class':'ring-lab'},gBack);t.textContent=l});
const center=el('g',{'class':'dot center',tabindex:'0',role:'button','aria-label':'Miss MacIntosh, My Darling, 1965'},gDots);
el('circle',{cx:CX,cy:CY,r:R0-8,fill:'#1C1813'},center);
['Miss MacIntosh,','My Darling','1965'].forEach((s,i)=>{const t=el('text',{x:CX,y:CY-16+i*20,'text-anchor':'middle','class':i<2?'c-title':'c-year'},center);t.textContent=s});
by.mmmd.node=center;
ids.forEach(id=>{if(id==='mmmd')return;const b=by[id];
  const g=el('g',{'class':'dot',tabindex:'0',role:'button','aria-label':b.title+', '+(b.author?b.author+', ':'')+b.year},gDots);
  el('circle',{cx:b.px,cy:b.py,r:15,fill:'transparent'},g);
  el('circle',{cx:b.px,cy:b.py,r:b.fam==='Y'?10:7.5,fill:FAM[b.fam].color,stroke:'#EEE5CF','stroke-width':'1.5','class':'pip'},g);
  b.node=g;
});
Object.values(by).forEach(b=>{b.node.addEventListener('click',()=>select(b.id,true));b.node.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select(b.id,true)}});b.node.addEventListener('mouseenter',()=>hover(b.id));b.node.addEventListener('mouseleave',()=>hover(null));b.node.addEventListener('focus',()=>hover(b.id));b.node.addEventListener('blur',()=>hover(null))});

const short=s=>{s=s.replace(/^The novels of /,'').split(/[:(]/)[0].trim();return s.length>30?s.slice(0,28).trim()+'…':s};
let boxes=[];
function label(id,cls){const b=by[id];if(id==='mmmd')return;const s=short(b.title),w=s.length*(cls==='sel'?10.5:9.2);
  let right=b.px>=CX;if(right&&b.px+13+w>812)right=false;else if(!right&&b.px-13-w<-12)right=true;
  const x0=right?b.px+13:b.px-13-w;let y=b.py+5;
  const hit=yy=>boxes.some(q=>x0<q[0]+q[2]&&x0+w>q[0]&&Math.abs(yy-q[1])<19);
  for(let k=1;k<8&&hit(y);k++)y=b.py+5+(k%2?1:-1)*Math.ceil(k/2)*19;
  boxes.push([x0,y,w]);
  const t=el('text',{x:right?b.px+13:b.px-13,y,'text-anchor':right?'start':'end','class':cls},gLab);t.textContent=s}
function hover(id){gLab.querySelectorAll('.hov').forEach(n=>n.remove());boxes=boxes.filter(q=>!q[3]);if(id&&id!==sel&&id!=='mmmd'){label(id,'hov');boxes[boxes.length-1]&&boxes[boxes.length-1].push(1)}}

let sel=null,mode=null;
const info=document.getElementById('rm-info');
const href=t=>/^https?:/.test(t)?t:(t==='index'?'index.html':t+'.html');
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function chips(th){return th.map(t=>'<span class="th th-'+t+'">'+esc(TH[t][0])+'</span>').join('')}
function select(id,scroll){
  sel=id;const b=by[id];
  gLines.innerHTML='';gLab.innerHTML='';boxes=[];
  if(id!=='mmmd')el('line',{x1:CX,y1:CY,x2:b.px,y2:b.py,'class':'ln-c'},gLines);
  label(id,'sel');
  b.x.forEach(o=>{const c=by[o];el('line',{x1:b.px,y1:b.py,x2:c.px,y2:c.py,stroke:FAM[c.fam].color,'class':'ln'},gLines);label(o,'conn')});
    Object.values(by).forEach(d=>d.node.classList.toggle('on',d.id===id));
  Object.values(by).forEach(d=>d.node.classList.toggle('near',b.x.includes(d.id)));
  svg.classList.add('picked');
  const f=FAM[b.fam];
  info.innerHTML='<p class="fam" style="color:'+f.color+'">'+esc(f.name)+'</p>'+
   '<h3><i>'+esc(b.title)+'</i></h3><p class="by">'+(b.author?esc(b.author)+' · ':'')+esc(b.year)+'</p>'+
   '<p>'+esc(b.about)+'</p><p class="young"><b>With Young.</b> '+esc(b.young)+'</p>'+
   '<div class="ths">'+chips(b.th)+'</div>'+
   (b.x.length?'<p class="lbl">Connected on the map</p><div class="xs">'+b.x.map(o=>'<button type="button" data-id="'+o+'" style="border-color:'+FAM[by[o].fam].color+'">'+esc(short(by[o].title))+'</button>').join('')+'</div>':'')+
   '<p class="lbl">Read more</p><ul class="lk">'+b.links.map(l=>'<li><a href="'+esc(href(l[1]))+'"'+(/^https?:/.test(l[1])?' target="_blank" rel="noopener"':'')+'>'+esc(l[0])+'</a></li>').join('')+'</ul>';
  info.querySelectorAll('.xs button').forEach(bt=>bt.addEventListener('click',()=>select(bt.dataset.id,true)));
  document.querySelectorAll('#rm-list .row').forEach(r=>r.classList.toggle('on',r.dataset.id===id));
  if(scroll&&window.matchMedia('(max-width: 899px)').matches)info.scrollIntoView({behavior:'smooth',block:'nearest'});
}
function filter(kind,key){
  mode=key?[kind,key]:null;
  const ok=d=>!mode||(kind==='th'?d.th.includes(key):d.fam===key);
  Object.values(by).forEach(d=>d.node.classList.toggle('dim',d.id!=='mmmd'&&!ok(d)));
  document.querySelectorAll('#rm-list .row').forEach(r=>r.hidden=!ok(by[r.dataset.id]));
  document.querySelectorAll('#rm-list .grp').forEach(g=>g.hidden=![...g.querySelectorAll('.row')].some(r=>!r.hidden));
  document.querySelectorAll('.rmap .feel button,.rmap .fams button').forEach(b=>b.setAttribute('aria-pressed',String(!!mode&&b.dataset.k===key&&b.dataset.kind===kind)));
  const note=document.getElementById('rm-feelnote');
  if(kind==='th'&&key){const n=Object.values(by).filter(d=>d.id!=='mmmd'&&d.th.includes(key)).length;note.innerHTML='<b>'+esc(TH[key][0])+'.</b> '+n+' books on the map carry this thread. Begin with <button type="button" class="pick" data-id="'+PICK[key]+'"><i>'+esc(by[PICK[key]].title)+'</i></button>.';note.querySelector('.pick').addEventListener('click',()=>select(PICK[key],true));select(PICK[key],false)}
  else if(kind==='fam'&&key){note.innerHTML='<b>'+esc(FAM[key].name)+'.</b> '+esc(FAM[key].blurb)}
  else note.textContent='';
}
/* feelings */
const fe=document.getElementById('rm-feel');
Object.keys(TH).forEach(k=>{const b=document.createElement('button');b.type='button';b.dataset.k=k;b.dataset.kind='th';b.className='th-'+k;b.textContent=TH[k][1];b.setAttribute('aria-pressed','false');b.addEventListener('click',()=>filter('th',mode&&mode[1]===k?null:k));fe.appendChild(b)});
const fa=document.getElementById('rm-fams');
order.slice().sort((a,b)=>'YSCAL'.indexOf(a)-'YSCAL'.indexOf(b)).forEach(k=>{const b=document.createElement('button');b.type='button';b.dataset.k=k;b.dataset.kind='fam';b.innerHTML='<span class="sw" style="background:'+FAM[k].color+'"></span>'+esc(FAM[k].name);b.setAttribute('aria-pressed','false');b.addEventListener('click',()=>filter('fam',mode&&mode[1]===k?null:k));fa.appendChild(b)});
document.getElementById('rm-all').addEventListener('click',()=>{filter(null,null);select('mmmd',false)});
/* list */
const host=document.getElementById('rm-list');
'YSCAL'.split('').forEach(f=>{const g=document.createElement('div');g.className='grp';g.innerHTML='<h3 style="color:'+FAM[f].color+'">'+esc(FAM[f].name)+'</h3><p class="gb">'+esc(FAM[f].blurb)+'</p>';
  ids.filter(i=>by[i].fam===f).sort((a,b)=>by[a].y-by[b].y).forEach(i=>{const b=by[i];const r=document.createElement('button');r.type='button';r.className='row';r.dataset.id=i;r.innerHTML='<span class="t"><i>'+esc(b.title)+'</i></span><span class="a">'+(b.author?esc(b.author)+', ':'')+esc(b.year)+'</span>';r.addEventListener('click',()=>{select(i,false);document.getElementById('rm-plate').scrollIntoView({behavior:'smooth',block:'start'})});g.appendChild(r)});
  host.appendChild(g)});
const tl=document.getElementById('rm-tally');
[[ids.length-1,'books around the center'],[5,'families'],[Object.values(by).reduce((s,d)=>s+d.x.length,0)/2,'connections']].forEach(([n,t])=>{const li=document.createElement('li');const b=document.createElement('b');b.textContent=n;li.append(b,t);tl.appendChild(li)});
select('mmmd',false);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
