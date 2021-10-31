import React, { useState } from "react";
import { useSprings } from "react-spring/hooks";
import { useGesture } from "react-with-gesture";
import Card from "./Card";

import "../styles/Deck.css";

const cards = [1, 2, 3, 4, 5];

const objs = [
  {
    pics: [
"https://s3-media0.fl.yelpcdn.com/bphoto/Kax_19qwZS5tAHhxs5WUsQ/o.jpg"    ],
    name: "Isalita",
    age: "$$",
    distance: "0.7 miles away",
    text: "Mexican standards served in a rustic space with painted-brick walls & a festive streetside patio."
  },
  {
    pics: [
"https://media-cdn.tripadvisor.com/media/photo-s/13/d5/67/50/ramen.jpg"    ],
    name: "Tomukun Noodle Bar",
    age: "$$",
    distance: "1.3 miles away",
    text:
      "Upmarket noodle house dishes up udon, ramen & Pan-Asian mains amid a rich wood interior."
  },
  {
    pics: [
      "https://www.piperpartners.com/wp/wp-content/uploads/2014/11/13888662292_08b713c255_b.jpg", 
      "https://fastly.4sqi.net/img/general/600x600/1853578_lAQ5RpWr01ca3wfev9z74WwoYGryQWXKpU80JamBA7U.jpg"],
    name: "Neopapalis",
    age: "$",
    distance: "3 miles away",
    text: "Sleek spot for fired-to-order Neapolitan pizzas with fully customizable toppings."
  },
  {
    pics: [
      "https://advancelocal-adapter-image-uploads.s3.amazonaws.com/expo.advance.net/img/71f1072188/width2048/d69_117.jpeg", 
      "https://i0.wp.com/www.michigandaily.com/wp-content/uploads/2019/10/eaa.BOAA_.Fritas0015.jpg?fit=720%2C480&ssl=1"
    ],
    name: "Frita Batidos",
    age: "$$",
    distance: "2 miles away",
    text:
      "Stark white space with picnic table seating serves colorful cuban street food & tropical cocktails."
  },
  {
    pics: [
      "https://www.zingermanscreamery.com/app/uploads/2019/09/Screen-Shot-2019-09-05-at-5.57.54-PM.png"
    ],
    name: "Zingerman's Deli",
    age: "$$",
    distance: "2.7 miles away",
    text:
      "Locals line up for generous deli sandwiches at this funky, longtime market with specialty groceries."
  }
];

const to = i => ({
  x: 0,
  y: i * -10,
  scale: 1,
  rot: -10 + Math.random() * 20,
  delay: i * 100
});
const from = i => ({ rot: 0, scale: 1.5, y: -1000 });

const trans = (r, s) =>
  `perspective(1500px) rotateX(30deg) rotateY(${r /
    10}deg) rotateZ(${r}deg) scale(${s})`;

function Deck() {
  const [gone] = useState(() => new Set());

  const [props, set] = useSprings(cards.length, i => ({
    ...to(i),
    from: from(i)
  }));

  const bind = useGesture(
    ({
      args: [index],
      down,
      delta: [xDelta],
      distance,
      direction: [xDir],
      velocity
    }) => {
      const trigger = velocity > 0.2;

      const dir = xDir < 0 ? -1 : 1;

      if (!down && trigger) gone.add(index);

      set(i => {
        if (index !== i) return;
        const isGone = gone.has(index);

        const x = isGone ? (200 + window.innerWidth) * dir : down ? xDelta : 0;
        const midpoint = window.innerWidth / 2;
        if(x > midpoint){
          //console.error("righ swipe\n");
          // right swipe? link to another page with the info and website?
        }
        const rot = xDelta / 100 + (isGone ? dir * 10 * velocity : 0);

        const scale = down ? 1.1 : 1;
        return {
          x,
          rot,
          scale,
          delay: undefined,
          config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 }
        };
      });

      if (!down && gone.size === cards.length)
        setTimeout(() => gone.clear() || set(i => to(i)), 600);
    }
  );

  return props.map(({ x, y, rot, scale }, i) => (
    <Card
      i={i}
      x={x}
      y={y}
      rot={rot}
      scale={scale}
      trans={trans}
      cards={cards}
      objs={objs}
      bind={bind}
    />
  ));
}

export default Deck;
