import { createTRPCRouter, protectedProcedure } from "../trpc";

const quotes = [
  `I never dream to be anything not possible. - Blackpink`,
  `I'd ask myself, do you want to give up because it's not easy? - Blackpink`,
  `Life is not easy, there are so many crossroads... that's our life. - Blackpink`,
  `Don't rely on what others tell you to do, have a firm grasp and do something you like according to your own initiative. - Blackpink`,
  `Life is all about timing. - Blackpink`,
  `And I told you to smile. Why didn't you smile? - Lalisa Manoban`,
  `I told you to smile, but you just ignored my word and you just... - Lalisa Manoban`,
  `Now burn baby burn! - Lalisa Manoban`,
  `I feel bittersweet - Lalisa Manoban`,
  `Korea is OUR country, Thailand is MY country. - Lalisa Manoban`,
  `It's (Jisoo playing mobile and PC games) silly. - Lalisa Manoban`,
  `What's wrong with you? You dance wrong. - Lalisa Manoban`,
  `Even when the four seasons change, I don't. - Lalisa Manoban`,
  `Been a bad girl, I know I am. And I'm so hot, I need a fan. I don't want a boy, I need a man. - Lalisa Manoban`,
  `You should be afraid of people who work harder than you. - Lalisa Manoban`,
  `Spreading the word to the staff members about how the great song and video. - Lalisa Manoban`,
  `You don't have to do the hands like this.. It looks too dull. You know what I am sayin'? - Lalisa Manoban`,
  `Purple hearts for Lisa. - Lalisa Manoban`,
  `I be the Bonnie and you be my Cyde, we ride or die, x's and o's. - Lalisa Manoban`,
  `In the world full of lies my only truth is you. - Lalisa Manoban`,
  `When the night gets dark let me be your fire. - Lalisa Manoban`,
  `Enjoy living life to the fullest. - Lalisa Manoban`,
  `So don't play with me boy. - Lalisa Manoban`,
  `Look at you now look at me - Lalisa Manoban`,
  `BLACKPINK isn't possible if we're not four - Lalisa Manoban`,
  `You say I'm good because you're a Blink. Everyone, don’t think like that. The way you look at me and the way the world looks at me can be different. - Jenny Ruby Jane`,
  `All eyes on me when I step in the room. - Jenny Ruby Jane`,
  `Cut out your heart and show me confidently, sometimes chic, chic, so hot, so hot make me not know what to do, softly call out to me like a whistle in my ear. - Jenny Ruby Jane`,
  `Hands up, wit little bottle full of henny. - Jenny Ruby Jane`,
  `I personally like milk ice cream. - Jenny Ruby Jane`,
  `Unicorns are real. - Jenny Ruby Jane`,
  `Watch your mouth when you speak my name, Jennie. - Jenny Ruby Jane`,
  `No doctor could help when I'm lovesick. - Jenny Ruby Jane`,
  `Guys, that's like the most basic question, you guys should know that already about me cuz it's black and I don't even have to say it. - Jenny Ruby Jane`,
  `I am way too hungry to remember the name of the song. - Jenny Ruby Jane`,
  `Don't ask why it has to be you, just stay with me. - Jenny Ruby Jane`,
  `Blackpink is number one. We will continue to work hard to revive much love and support from fans. - Jenny Ruby Jane`,
  `Go away, Lisa. - Jenny Ruby Jane`,
  `They know you're Jisoo. - Jenny Ruby Jane`,
  `Do you know any cities in New Zealand? - Jenny Ruby Jane`,
  `Literally Netflix all day. - Jenny Ruby Jane`,
  `I only say my opinion once and I stop talking about that issue because people learn by making their own mistakes. If you keep saying negative things, you’ll end up hurting yourself and the person. - Kim Ji-soo`,
  `Even if the words that came to you aren’t beautiful, just ignore them. If you give tit-for-tat, you might stay up all night doing that. Initially, you’d have ended it reasonably with nice words. Bad words won’t end, and nitpicking won’t end. Just ignore them. - Kim Ji-soo`,
  `The people who dislike me will dislike me, the people who like me will like me, and the people who support me will support me. Regardless of the amount and depth, there are people who support me which makes it fine. If I’m being supported by one person, it’s good. - Kim Ji-soo`,
  `Love yourself first. However, if you do something for others, it can turn out that it is also for you. - Kim Ji-soo`,
  `It would be nice if people saw BLACKPINK and somehow gained confidence in themselves. Nothing ever just suited us perfectly from the beginning. So for our fans, find your own charm and gain your confidence through that. - Kim Ji-soo`,
  `It’s in my personality to not feel down when someone gets angry at me, or when I get criticized. It will be okay as long as I try harder, right? - Kim Ji-soo`,
];

export const quoteRouter = createTRPCRouter({
  getDailyQuote: protectedProcedure.query(() => {
    const index =
      (new Date().getDate() +
        new Date().getMonth() +
        new Date().getFullYear()) %
      (quotes.length + 1);
    return quotes[index];
  }),
});
