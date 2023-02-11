import { Grid, Image } from "semantic-ui-react"
const MyCafeBadge = () => {
    return (
        <section>
            <h1>방문 카페 도감</h1>
            <Grid divided>
    <Grid.Row>
      <Grid.Column width={5}>
        <Image src={require('../../../assets/cafe_logos/compose.png')} />
      </Grid.Column>
      <Grid.Column width={5}>
      <Image src={require('../../../assets/cafe_logos/compose.png')} />
      </Grid.Column>
      <Grid.Column width={5}>
        <Image src={require('../../../assets/cafe_logos/compose.png')} />
      </Grid.Column>
    </Grid.Row>

    <Grid.Row>
      <Grid.Column width={5}>
        <Image src={require('../../../assets/cafe_logos/compose.png')} />
      </Grid.Column>
      <Grid.Column width={5}>
        <Image src={require('../../../assets/cafe_logos/compose.png')} />
      </Grid.Column>
      <Grid.Column width={5}>
        <Image src={require('../../../assets/cafe_logos/compose.png')} />
      </Grid.Column>
    </Grid.Row>
  </Grid>
        </section>
    )
}

export default MyCafeBadge