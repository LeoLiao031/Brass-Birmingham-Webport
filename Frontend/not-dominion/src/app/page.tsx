import IndustryTile from './components/IndustryTile'

export default function Home() {
  return (
    <>
      <IndustryTile industry={'Brewery'} flipped={false} tier={1} victoryPoints={1} income={0} linkPoints={1} />
      <IndustryTile industry={'Cotton'} flipped={false} tier={2} flipCost={2} victoryPoints={2} income={0} linkPoints={0}/>
      <IndustryTile industry={'Manufacturing'} flipped={false} tier={3} flipCost={1} victoryPoints={3} income={0} linkPoints={0}/>
      <IndustryTile industry={'Manufacturing'} flipped={true} tier={3} flipCost={1} victoryPoints={6} income={4} linkPoints={1}/>
      <IndustryTile industry={'Cotton'} flipped={true} tier={6} flipCost={1} victoryPoints={10} income={10} linkPoints={2}/>
      <IndustryTile industry={'Iron'} flipped={false} tier={4} resourceCount={2} victoryPoints={5} income={0} linkPoints={0}/>
      <IndustryTile industry={'Coal'} flipped={false} tier={5} resourceCount={5} victoryPoints={6} income={0} linkPoints={0}/>
    </>
  )
}

