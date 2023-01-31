pipeline { // 파이프라인의 시작 
    // 스테이지 별로 다른 거
    agent any // 아무 젠킨스 agent나 써라  

    triggers {
        pollSCM('*/3 * * * *') // 3분주기로 파이프라인 구동하겠다
    }

    environment { // 파이프라인 안에서 쓸 환경변수들. 시스템 환경변수로 들어감 
      // AWS_ACCESS_KEY_ID = credentials('awsAccessKeyId') // aws명령을 자유롭게 쓰기 위해 설정
      // AWS_SECRET_ACCESS_KEY = credentials('awsSecretAccessKey') // aws명령을 자유롭게 쓰기 위해 설정
      AWS_DEFAULT_REGION = 'ap-northeast-2' // 서울 
      HOME = '.' // Avoid npm root owned
    }

    // 본격적인 파이프라인 내용 
    stages { // 각 stage는 큰 단계
        stage('Prepare') { // 1. prepare stage, 깃 레포지토리를 다운로드 받음
            agent any // agent는 아무나 
            
            steps {
                echo 'Clonning Repository'

                // git pull로 땡겨온다
                git url: 'https://lab.ssafy.com/s08-webmobile2-sub2/S08P12A308.git', // 내 git url
                    branch: 'release/FE/CICDTest', // 푸쉬할 브랜치, master로 하면 에러남. main으로 해야함 
                    credentialsId: 'A308Jenkins-DT' // git 크레덴셜 등록한 id
            }

            post {
                // If Maven was able to run the tests, even if some of the test
                // failed, record the test results and archive the jar file.
                success { // 성공시 실행
                    echo 'Successfully Pulled Repository'
                }

                always { // 성공하던 실패하던 실행
                  echo "i tried..."
                }

                cleanup { // post 내용이 모두 끝났을때 실행
                  echo "after all other post condition"
                }
            }
        }
        
        stage('Bulid Frontend') {
          // 도커 빌드 
          agent any
          steps {
            echo 'Build Frontend'

            // 도커 이미지 생성
            // server라는 이름으로 빌드, 도커파일이 현재 경로에 있어서 . 써줌 
            // docker build . -t server --build-arg env=${PROD}
            // -t 옵션으로 이미지에 server라는 태그를 달아줌 
            dir ('./frontend'){
                sh """
                docker build . -t frontend
                """
            }
          }
        post {
            // steps 끝나면 post온다
            // 빌드하다 실패하면 error 뱉고, 나머지 과정 하지말고 종료 
            failure {
              error 'This pipeline stops here...'
            }
          }
        }

        stage('Deploy Frontend') {
          agent any
          steps {
            echo 'Build Frontend'
            // 위에서 만든 이미지를 실행시키기 (원래 떠있던 이미지 지우고 실행)
            // 기존에 돌리던 이미지가 있을때만 run 코드 전에 docker rm -f $(docker ps -aq) 추가
            // server라는 태그
            dir ('./frontend'){
                sh '''
                docker run -p 3000:3000 -d frontend
                '''
            }
          }

          post {
            success {
                  echo 'Deploy Frontend success!'
            }
          }
        }
    }
}

