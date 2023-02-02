import { Card } from "semantic-ui-react"
import { Skeleton } from "primereact/skeleton"
import "./LoadingPost.css"

const LoadingPost = () => {
  return (
    <Card fluid raised>
      <div className="custom-skeleton">
        <div className="skeleton-header">
          <div className="user-info">
            <Skeleton shape="circle" size="4rem" className="logo"></Skeleton>
            <div className="user-description">
              <Skeleton width="10rem"></Skeleton>
              <Skeleton width="8rem"></Skeleton>
            </div>
          </div>

          <Skeleton width="4rem" height="2rem"></Skeleton>
        </div>
        <Skeleton width="100%" height="150px"></Skeleton>
        <div className="skeleton-content">
          <Skeleton width="100%"></Skeleton>
          <Skeleton width="100%"></Skeleton>
        </div>
        <div className="skeleton-footer">
          <Skeleton width="49%" height="2rem"></Skeleton>
          <Skeleton width="49%" height="2rem"></Skeleton>
        </div>
      </div>
    </Card>
  )
}

export default LoadingPost
